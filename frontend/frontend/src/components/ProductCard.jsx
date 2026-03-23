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
      radius="lg"
      withBorder
      padding="lg"
      style={{
        cursor: "pointer",
        transition: "all 0.2s ease",
      }}
      onClick={() => navigate(`/products/${product.id}`)}
      onMouseEnter={(e) => {
        if (window.innerWidth > 768) {
          e.currentTarget.style.transform = "translateY(-4px)";
          e.currentTarget.style.boxShadow =
            "0 8px 20px rgba(0,0,0,0.08)";
        }
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
            height: "clamp(140px, 30vw, 200px)", // 🔥 responsive height
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            overflow: "hidden",
            background: "#f8f9fa",
            padding: "10px",
          }}
        >
          <Image
            src={getImageUrl(product.imageUrl)}
            fit="contain"
            style={{
              maxHeight: "100%",
              width: "100%",
              objectFit: "contain",
            }}
          />
        </Box>
      </Card.Section>

      {/* 🔥 CONTENT */}
      <Stack mt="md" gap="xs">
        {/* NAME */}
        <Text
          fw={600}
          lineClamp={2}
          style={{
            fontSize: "clamp(14px, 2.5vw, 16px)",
            minHeight: "40px", // 🔥 keeps cards aligned
          }}
        >
          {product.name}
        </Text>

        {/* PRICE */}
        <Text
          fw={700}
          c="blue"
          style={{
            fontSize: "clamp(16px, 3vw, 18px)",
          }}
        >
          {product.price} QAR
        </Text>

        {/* RATING */}
        <Group gap={6} align="center">
          <Rating
            value={avgRating}
            fractions={2}
            readOnly
            size="sm"
          />
          <Text size="xs" c="dimmed">
            ({count})
          </Text>
        </Group>
      </Stack>
    </Card>
  );
}