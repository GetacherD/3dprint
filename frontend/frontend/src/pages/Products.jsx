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
  Button,
  Badge, // 🔥 NEW
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

  const [categories, setCategories] = useState([]);
  const [category, setCategory] = useState("");

  const [heroTitle, setHeroTitle] = useState("");
  const [heroDesc, setHeroDesc] = useState("");

  useEffect(() => {
    api.get("/api/products?page=0&size=50").then((res) => {
      const data = res.data.data.content;
      setProducts(data);
      setFiltered(data);
      setLoading(false);
    });

    api.get("/api/categories").then((res) => {
      setCategories(res.data);
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

  // 🔥 COUNT PER CATEGORY
  const getCategoryCount = (categoryName) => {
    return products.filter((p) => p.categoryName === categoryName).length;
  };

  const applyFilter = (searchValue, min, max, categoryValue) => {
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

    if (categoryValue) {
      result = result.filter(
        (p) => p.categoryName === categoryValue
      );
    }

    setFiltered(result);
  };

  const debouncedSearch = debounce((value) => {
    applyFilter(value, minPrice, maxPrice, category);
  }, 300);

  return (
    <>
      {/* HERO */}
      <Box
        style={{
          background: "linear-gradient(135deg, #4c6ef5, #15aabf)",
          color: "white",
          padding: "60px 16px",
          marginBottom: "24px",
        }}
      >
        <Container size="lg">
          <Stack gap="xs">
            <Title fw={800} style={{ fontSize: "clamp(24px, 5vw, 40px)" }}>
              {heroTitle || "3D Printing Marketplace"}
            </Title>

            <Text size="sm" style={{ opacity: 0.9 }}>
              {heroDesc}
            </Text>
          </Stack>
        </Container>
      </Box>

      {/* FILTER */}
      <Container size="lg" mb="lg">
        <Box
          style={{
            background: "white",
            padding: "16px",
            borderRadius: "12px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
          }}
        >
          <Stack gap="sm">

            {/* SEARCH */}
            <TextInput
              placeholder="Search products..."
              leftSection={<IconSearch size={16} />}
              value={search}
              onChange={(e) => {
                const value = e.target.value;
                setSearch(value);
                debouncedSearch(value);
              }}
            />

            {/* 🔥 CATEGORY PILLS WITH COUNT */}
            <Group wrap="nowrap" style={{ overflowX: "auto" }}>
              <Button
                variant={category === "" ? "filled" : "light"}
                onClick={() => {
                  setCategory("");
                  applyFilter(search, minPrice, maxPrice, "");
                }}
              >
                All
                <Badge ml={6}>{products.length}</Badge>
              </Button>

              {categories.map((c) => {
                const count = getCategoryCount(c.name);

                return (
                  <Button
                    key={c.id}
                    variant={category === c.name ? "filled" : "light"}
                    onClick={() => {
                      setCategory(c.name);
                      applyFilter(search, minPrice, maxPrice, c.name);
                    }}
                  >
                    {c.name}
                    <Badge ml={6}>{count}</Badge>
                  </Button>
                );
              })}
            </Group>

            {/* PRICE */}
            <Group grow>
              <NumberInput
                placeholder="Min Price"
                value={minPrice}
                onChange={(value) => {
                  setMinPrice(value);
                  applyFilter(search, value, maxPrice, category);
                }}
              />

              <NumberInput
                placeholder="Max Price"
                value={maxPrice}
                onChange={(value) => {
                  setMaxPrice(value);
                  applyFilter(search, minPrice, value, category);
                }}
              />
            </Group>

          </Stack>
        </Box>
      </Container>

      <Container size="lg">
        <Title order={3} mb="md">Products</Title>
      </Container>

      {/* PRODUCTS */}
      <Container size="lg">
        {loading ? (
          <SimpleGrid cols={{ base: 1, sm: 2, md: 3, lg: 4 }}>
            {[...Array(8)].map((_, i) => (
              <Skeleton key={i} height={250} />
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