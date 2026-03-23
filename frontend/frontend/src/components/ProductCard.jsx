import {
  Card,
  Image,
  Text,
  Group,
  Rating,
  Stack,
  Box,
  Badge, // 🔥 NEW
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

  const imageSrc = getImageUrl(product.imageUrl) || null;

  return (
    <Card
      radius="lg"
      withBorder
      padding="lg"
      style={{ cursor: "pointer", transition: "0.2s" }}
      onClick={() => navigate(`/products/${product.id}`)}
    >
      {/* IMAGE */}
      <Card.Section>
        <Box
          style={{
            height: "clamp(140px, 30vw, 200px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "#f8f9fa",
            padding: "10px",
          }}
        >
          {imageSrc ? (
            <Image src={imageSrc} fit="contain" />
          ) : (
            <Text size="xs" c="dimmed">No Image</Text>
          )}
        </Box>
      </Card.Section>

      <Stack mt="md" gap="xs">

        {/* 🔥 CATEGORY BADGE */}
        {product.categoryName && (
          <Badge size="xs" color="blue" variant="light">
            {product.categoryName}
          </Badge>
        )}

        <Text fw={600} lineClamp={2}>
          {product.name}
        </Text>

        <Text fw={700} c="blue">
          {product.price} QAR
        </Text>

        <Group gap={6}>
          <Rating value={avgRating} fractions={2} readOnly size="sm" />
          <Text size="xs">({count})</Text>
        </Group>

      </Stack>
    </Card>
  );
}