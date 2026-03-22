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

  useEffect(() => {
    api.get("/api/products?page=0&size=50").then((res) => {
      const data = res.data.data.content;
      setProducts(data);
      setFiltered(data);
      setLoading(false);
    });
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
          padding: "60px 20px",
          marginBottom: "30px",
        }}
      >
        <Container size="lg">
          <Stack gap="xs">
            <Title order={1}>3D Printing Marketplace</Title>
            <Text size="lg">
              Explore products freely. Login only when you're ready to buy.
            </Text>
          </Stack>
        </Container>
      </Box>

      {/* FILTER BAR */}
      <Container size="lg" mb="md">
        <Group grow>
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

          <NumberInput
            placeholder="Min Price"
            value={minPrice}
            onChange={(value) => {
              setMinPrice(value);
              applyFilter(search, value, maxPrice);
            }}
          />

          <NumberInput
            placeholder="Max Price"
            value={maxPrice}
            onChange={(value) => {
              setMaxPrice(value);
              applyFilter(search, minPrice, value);
            }}
          />
        </Group>
      </Container>

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
