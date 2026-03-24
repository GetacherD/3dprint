import {
  Card,
  Image,
  Text,
  Group,
  Rating,
  Stack,
  Box,
  Badge,
  Button,
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
      radius="var(--radius-lg)"
      withBorder
      padding={0}
      className="card-hover"
      style={{
        cursor: "pointer",
        borderColor: "var(--border)",
        overflow: "hidden",
        background: "var(--bg-card)",
        height: "100%",
      }}
      onClick={() => navigate(`/products/${product.id}`)}
    >
      {/* IMAGE */}
      <Card.Section>
        <Box
          className="product-card-media"
          style={{
            height: "clamp(230px, 38vw, 300px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "linear-gradient(165deg, #f2f3f6 0%, #e6e9ef 100%)",
            padding: 0,
            position: "relative",
            overflow: "hidden",
          }}
        >
          {imageSrc ? (
            <Image
              className="product-card-media-image"
              src={imageSrc}
              fit="cover"
              h="100%"
              w="100%"
              style={{
                filter: "drop-shadow(0 3px 8px rgba(17, 24, 39, 0.35)) contrast(1.06)",
                objectFit: "cover",
              }}
            />
          ) : (
            <Text
              size="xs"
              fw={600}
              c="var(--text-primary)"
              style={{
                background: "rgba(255,255,255,0.82)",
                border: "1px solid var(--border)",
                borderRadius: "var(--radius-pill)",
                padding: "4px 10px",
              }}
            >
              No Image
            </Text>
          )}

          {product.categoryName && (
            <Badge
              className="product-card-media-badge"
              size="xs"
              style={{
                position: "absolute",
                top: 12,
                left: 12,
                borderRadius: "var(--radius-pill)",
                background: "rgba(31, 41, 55, 0.9)",
                color: "#fff",
                border: "1px solid rgba(255,255,255,0.35)",
                textShadow: "0 1px 1px rgba(0,0,0,0.3)",
                textTransform: "uppercase",
                fontWeight: 700,
              }}
            >
              {product.categoryName}
            </Badge>
          )}
        </Box>
      </Card.Section>

      <Stack p={8} gap={4} style={{ position: "relative", zIndex: 1 }}>

        <Text fw={700} size="sm" c="var(--text-primary)" lineClamp={2} style={{ minHeight: 34, lineHeight: 1.3 }}>
          {product.name}
        </Text>

        <Text fw={800} size="md" c="var(--primary)">
          {product.price} QAR
        </Text>

        <Group gap={6} align="center">
          <Rating value={avgRating} fractions={2} readOnly size="xs" />
          <Text size="xs" c="var(--text-secondary)">({count})</Text>
        </Group>

        <Button
          fullWidth
          radius="xl"
          size="xs"
          style={{
            marginTop: 4,
            background: "var(--primary)",
            color: "#fff",
            fontWeight: 700,
            boxShadow: "var(--shadow-sm)",
          }}
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/products/${product.id}`);
          }}
        >
          View details
        </Button>

      </Stack>
    </Card>
  );
}