import {
  Container,
  SimpleGrid,
  Title,
  Text,
  Box,
  Skeleton,
  Stack,
  TextInput,
  NumberInput,
  Group,
} from "@mantine/core";
import { useEffect, useState } from "react";
import api from "../api/axios";
import ProductCard from "../components/ProductCard";
import { IconSearch } from "@tabler/icons-react";
import { debounce } from "lodash";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  const [heroTitle, setHeroTitle] = useState("");
  const [heroDesc, setHeroDesc] = useState("");

  useEffect(() => {
    api.get("/api/products?page=0&size=50").then((res) => {
      const data = res.data.data.content;
      setProducts(data);
      setFiltered(data);
      setLoading(false);
    });

    api.get("/api/content/hero_title")
      .then(res => setHeroTitle(res.data.data))
      .catch(() => setHeroTitle("3D Printing Marketplace"));

    api.get("/api/content/hero_description")
      .then(res => setHeroDesc(res.data.data))
      .catch(() =>
        setHeroDesc("Discover high-quality 3D printed products. Simple, fast, and reliable.")
      );
  }, []);

  const applyFilter = (searchValue, min, max) => {
    let result = [...products];

    if (searchValue) {
      result = result.filter((p) =>
        p.name.toLowerCase().includes(searchValue.toLowerCase())
      );
    }

    if (min !== "") {
      result = result.filter((p) => p.price >= Number(min));
    }

    if (max !== "") {
      result = result.filter((p) => p.price <= Number(max));
    }

    setFiltered(result);
  };

  const debouncedSearch = debounce((value) => {
    applyFilter(value, minPrice, maxPrice);
  }, 300);

  return (
    <>
      {/* 🔥 HERO (RESPONSIVE) */}
      <Box
        style={{
          background: "linear-gradient(135deg, #4c6ef5, #15aabf)",
          color: "white",
          padding: "60px 16px", // 🔥 smaller padding mobile
          marginBottom: "24px",
        }}
      >
        <Container size="lg">
          <Stack gap="xs">
            <Title
              fw={800}
              style={{
                fontSize: "clamp(24px, 5vw, 40px)", // 🔥 responsive font
                lineHeight: 1.2,
              }}
            >
              {heroTitle || "3D Printing Marketplace"}
            </Title>

            <Text size="sm" style={{ opacity: 0.9 }}>
              {heroDesc ||
                "Discover high-quality 3D printed products. Simple, fast, and reliable."}
            </Text>
          </Stack>
        </Container>
      </Box>

      {/* 🔥 FILTER BAR */}
      <Container size="lg" mb="lg">
        <Box
          style={{
            background: "white",
            padding: "16px",
            borderRadius: "12px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
          }}
        >
          {/* 🔥 MOBILE STACK / DESKTOP ROW */}
          <Stack gap="sm">
            <TextInput
              placeholder="Search products..."
              leftSection={<IconSearch size={16} />}
              radius="md"
              value={search}
              onChange={(e) => {
                const value = e.target.value;
                setSearch(value);
                debouncedSearch(value);
              }}
            />

            <Group grow>
              <NumberInput
                placeholder="Min Price"
                radius="md"
                value={minPrice}
                onChange={(value) => {
                  setMinPrice(value);
                  applyFilter(search, value, maxPrice);
                }}
              />

              <NumberInput
                placeholder="Max Price"
                radius="md"
                value={maxPrice}
                onChange={(value) => {
                  setMaxPrice(value);
                  applyFilter(search, minPrice, value);
                }}
              />
            </Group>
          </Stack>
        </Box>
      </Container>

      {/* 🔥 TITLE FIX (inside container) */}
      <Container size="lg">
        <Title order={3} mb="md">
          Products
        </Title>
      </Container>

      {/* 🔥 PRODUCTS */}
      <Container size="lg">
        {loading ? (
          <SimpleGrid cols={{ base: 1, sm: 2, md: 3, lg: 4 }}>
            {[...Array(8)].map((_, i) => (
              <Skeleton key={i} height={250} radius="md" />
            ))}
          </SimpleGrid>
        ) : filtered.length === 0 ? (
          <Text>No products found</Text>
        ) : (
          <SimpleGrid cols={{ base: 1, sm: 2, md: 3, lg: 4 }}>
            {filtered.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </SimpleGrid>
        )}
      </Container>
    </>
  );
}