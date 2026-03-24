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
  Badge,
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
          background: "radial-gradient(circle at 20% 0%, #f7b39f 0%, #e07a5f 36%, #7c6cf4 100%)",
          color: "white",
          padding: "44px 16px 38px",
          marginBottom: "20px",
        }}
      >
        <Container size="lg">
          <Stack gap={10}>
            <Title fw={800} style={{ fontSize: "clamp(1.6rem, 5.5vw, 2.7rem)", lineHeight: 1.14 }}>
              {heroTitle || "3D Printing Marketplace"}
            </Title>

            <Text size="sm" style={{ opacity: 0.94, maxWidth: 680 }}>
              {heroDesc}
            </Text>

            <Group mt={6} gap="sm" wrap="wrap">
              <Button radius="xl" color="dark" style={{ color: "#fff", fontWeight: 700 }}>
                Explore now
              </Button>
              <Button
                radius="xl"
                variant="light"
                style={{
                  background: "rgba(255,255,255,0.92)",
                  color: "var(--text-primary)",
                  border: "1px solid rgba(255,255,255,0.35)",
                  fontWeight: 700,
                }}
              >
                Top categories
              </Button>
            </Group>
          </Stack>
        </Container>
      </Box>

      {/* FILTER */}
      <Container size="lg" mb="lg">
        <Box
          style={{
            background: "white",
            padding: "16px",
            borderRadius: "var(--radius-lg)",
            boxShadow: "var(--shadow-sm)",
            border: "1px solid var(--border)",
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
            <Group wrap="nowrap" style={{ overflowX: "auto", paddingBottom: 2 }}>
              <Button
                radius="xl"
                variant={category === "" ? "filled" : "light"}
                style={{ flexShrink: 0 }}
                onClick={() => {
                  setCategory("");
                  applyFilter(search, minPrice, maxPrice, "");
                }}
              >
                All
                <Badge ml={6} variant="filled" color={category === "" ? "dark" : "gray"}>
                  {products.length}
                </Badge>
              </Button>

              {categories.map((c) => {
                const count = getCategoryCount(c.name);

                return (
                  <Button
                    key={c.id}
                    radius="xl"
                    variant={category === c.name ? "filled" : "light"}
                    style={{ flexShrink: 0 }}
                    onClick={() => {
                      setCategory(c.name);
                      applyFilter(search, minPrice, maxPrice, c.name);
                    }}
                  >
                    {c.name}
                    <Badge ml={6} variant="filled" color={category === c.name ? "dark" : "gray"}>
                      {count}
                    </Badge>
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
                styles={{ input: { borderRadius: "var(--radius-md)" } }}
              />

              <NumberInput
                placeholder="Max Price"
                value={maxPrice}
                onChange={(value) => {
                  setMaxPrice(value);
                  applyFilter(search, minPrice, value, category);
                }}
                styles={{ input: { borderRadius: "var(--radius-md)" } }}
              />
            </Group>

          </Stack>
        </Box>
      </Container>

      <Container size="lg">
        <Title order={3} mb="md" c="var(--text-primary)">Products</Title>
      </Container>

      {/* PRODUCTS */}
      <Container size="lg">
        {loading ? (
          <SimpleGrid cols={{ base: 1, xs: 2, md: 3, lg: 3, xl: 4 }} spacing="md">
            {[...Array(8)].map((_, i) => (
              <Skeleton key={i} height={260} radius="var(--radius-lg)" />
            ))}
          </SimpleGrid>
        ) : filtered.length === 0 ? (
          <Text c="var(--text-secondary)">No products found</Text>
        ) : (
          <SimpleGrid cols={{ base: 1, xs: 2, md: 3, lg: 3, xl: 4 }} spacing="md">
            {filtered.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </SimpleGrid>
        )}
      </Container>
    </>
  );
}