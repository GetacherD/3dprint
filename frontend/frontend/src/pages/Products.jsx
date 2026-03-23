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

  // 🔥 FILTER LOGIC
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

  // 🔥 DEBOUNCED SEARCH
  const debouncedSearch = debounce((value) => {
    applyFilter(value, minPrice, maxPrice);
  }, 300);

  return (
    <>
      {/* HERO */}
      <Box

  style={{
    background: "linear-gradient(135deg, #4c6ef5, #15aabf)",
    color: "white",
    padding: "80px 20px",
    marginBottom: "40px",
  }}
>
  <Container size="lg">
    <Stack gap="sm">
      <Title order={1} fw={800}>
  {heroTitle || "3D Printing Marketplace"}
</Title>

<Text size="lg" opacity={0.9}>
  {heroDesc || "Discover high-quality 3D printed products. Simple, fast, and reliable."}
</Text>
    </Stack>
  </Container>
</Box>

      {/* FILTER BAR */}
     <Container size="lg" mb="xl">
  <Box
    style={{
      background: "white",
      padding: "20px",
      borderRadius: "12px",
      boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
    }}
  >
    <Group grow>
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
  </Box>
</Container>
<Title order={3} mb="md">
  Products
</Title>
      {/* PRODUCTS */}
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
