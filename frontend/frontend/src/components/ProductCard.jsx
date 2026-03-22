import { Card, Image, Text, Group, Rating } from "@mantine/core";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../api/axios";

export default function ProductCard({ product }) {
  const navigate = useNavigate();

  const [avgRating, setAvgRating] = useState(0);
  const [count, setCount] = useState(0);
  const [latestComment, setLatestComment] = useState("");

  useEffect(() => {
    api.get(`/api/reviews/${product.id}`).then((res) => {
      const reviews = res.data.data;

      if (reviews.length > 0) {
        // ⭐ average
        const avg =
          reviews.reduce((sum, r) => sum + r.rating, 0) /
          reviews.length;

        setAvgRating(avg);
        setCount(reviews.length);

        // 🆕 newest comment
        const newest = [...reviews].sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        )[0];

        setLatestComment(newest.comment);
      }
    });
  }, [product.id]);

  return (
    <Card
      shadow="sm"
      radius="lg"
      withBorder
      style={{ cursor: "pointer" }}
      onClick={() => navigate(`/products/${product.id}`)}
    >
      <Card.Section>
        <Image
          src={`${product.imageUrl}`}
          height={180}
          fit="cover"
        />
      </Card.Section>

      <Text fw={600} mt="sm">
        {product.name}
      </Text>

      <Text size="sm" c="dimmed">
        {product.price} QAR
      </Text>

      {/* ⭐ RATING */}
      <Group mt="xs" gap={5}>
        <Rating value={avgRating} fractions={2} readOnly size="sm" />
        <Text size="xs" c="dimmed">
          ({count})
        </Text>
      </Group>

      {/* 💬 REVIEW TEASER */}
      {latestComment && (
        <Text
          size="xs"
          mt="xs"
          c="dimmed"
          lineClamp={2} // 🔥 truncate
          style={{ fontStyle: "italic" }}
        >
          “{latestComment}”
        </Text>
      )}
    </Card>
  );
}
