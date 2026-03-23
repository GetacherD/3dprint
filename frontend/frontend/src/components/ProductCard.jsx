import {
  Card,
  Image,
  Text,
  Group,
  Rating,
  Stack,
  Box,
} from "@mantine/core";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../api/axios";
import { getImageUrl } from "../utils/image";

export default function ProductCard({ product }) {
  const navigate = useNavigate();

  const [avgRating, setAvgRating] = useState(0);
  const [count, setCount] = useState(0);

  useEffect(() => {
    api.get(`/api/reviews/${product.id}`).then((res) => {
      const reviews = res.data.data;

      if (reviews.length > 0) {
        const avg =
          reviews.reduce((sum, r) => sum + r.rating, 0) /
          reviews.length;

        setAvgRating(avg);
        setCount(reviews.length);
      }
    });
  }, [product.id]);

  return (
    <Card
      radius="xl"
      withBorder
      padding="md"
      style={{
        cursor: "pointer",
        transition: "all 0.25s ease",
      }}
      onClick={() => navigate(`/products/${product.id}`)}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-5px)";
        e.currentTarget.style.boxShadow =
          "0 10px 25px rgba(0,0,0,0.1)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "none";
        e.currentTarget.style.boxShadow = "none";
      }}
    >
      {/* 🔥 IMAGE */}
      <Card.Section>
        <Box
          style={{
            height: 200,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            overflow: "hidden",
            background: "#f8f9fa",
          }}
        >
          <Image
            src={getImageUrl(product.imageUrl)}
            fit="contain"
            style={{
              maxHeight: "100%",
              transition: "transform 0.3s ease",
            }}
          />
        </Box>
      </Card.Section>

      <Stack mt="sm" gap={6}>

        {/* 🔥 NAME */}
        <Text fw={600} lineClamp={2}>
          {product.name}
        </Text>

        {/* 🔥 PRICE (IMPORTANT VISUAL) */}
        <Text fw={700} size="lg" c="blue">
          {product.price} QAR
        </Text>

        {/* ⭐ RATING */}
        <Group gap={4}>
          <Rating value={avgRating} fractions={2} readOnly size="sm" />
          <Text size="xs" c="dimmed">
            ({count})
          </Text>
        </Group>

      </Stack>
    </Card>
  );
}