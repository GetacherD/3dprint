import {
  Container,
  Grid,
  Image,
  Title,
  Text,
  Badge,
  Button,
  Stack,
  Paper,
  Skeleton,
  Rating,
  Textarea,
  Divider,
  Group,
  Select,
  Box,
} from "@mantine/core";
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState, useContext, useRef } from "react";
import api from "../api/axios";
import { AuthContext } from "../context/AuthContext";
import { CartContext } from "../context/CartContext";
import { notifications } from "@mantine/notifications";
import { Carousel } from "@mantine/carousel";
import "@mantine/carousel/styles.css";
import { getImageUrl } from "../utils/image";

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);

  const { token } = useContext(AuthContext);
  const { addToCart } = useContext(CartContext);
  const navigate = useNavigate();

  const [isZooming, setIsZooming] = useState(false);
  const [zoomPos, setZoomPos] = useState({ x: 50, y: 50 });
  const [activeIndex, setActiveIndex] = useState(0);
  const [fullscreen, setFullscreen] = useState(false);

  const [added, setAdded] = useState(false);

  const [reviews, setReviews] = useState([]);
  const [myReview, setMyReview] = useState(null);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [sort, setSort] = useState("newest");

  const reviewRef = useRef(null);

  useEffect(() => {
    loadData();
  }, [id]);

  const loadData = async () => {
    const productRes = await api.get(`/api/products/${id}`);
    setProduct(productRes.data.data);

    const reviewRes = await api.get(`/api/reviews/${id}`);
    const allReviews = reviewRes.data.data;

    setReviews(allReviews);

    if (token) {
      try {
        const decoded = JSON.parse(atob(token.split(".")[1]));
        const currentUser = decoded.sub;

        const mine = allReviews.find(
          (r) => r.userName === currentUser
        );

        if (mine) {
          setMyReview(mine);
          setRating(mine.rating);
          setComment(mine.comment);
        } else {
          setMyReview(null);
        }
      } catch {}
    }
  };

  const handleBuy = () => {
    if (!token) {
      notifications.show({
        title: "Login required",
        message: "Please login to continue",
        color: "yellow",
      });
      navigate("/login");
      return;
    }
  };

  const handleAddToCart = () => {
    addToCart(product);
    setAdded(true);

    notifications.show({
      title: "Added to cart",
      message: `${product.name} added successfully`,
      color: "green",
    });

    setTimeout(() => setAdded(false), 2000);
  };

  const handleSubmitReview = async () => {
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      if (myReview) {
        await api.put(`/api/reviews/${myReview.id}`, {
          productId: id,
          rating,
          comment,
        });
      } else {
        await api.post("/api/reviews", {
          productId: id,
          rating,
          comment,
        });
      }

      notifications.show({
        title: "Success",
        message: "Review saved",
        color: "green",
      });

      loadData();

      // 🔥 AUTO SCROLL
      reviewRef.current.scrollIntoView({ behavior: "smooth" });

    } catch (err) {
      notifications.show({
        title: "Error",
        message: err.response?.data?.message,
        color: "red",
      });
    }
  };

  const handleDeleteReview = async () => {
    await api.delete(`/api/reviews/${myReview.id}`);
    setMyReview(null);
    setRating(0);
    setComment("");
    loadData();
  };

  if (!product) {
    return (
      <Box style={{ background: "var(--bg-primary)", minHeight: "100vh", padding: "24px 12px" }}>
        <Container size="lg">
          <Skeleton height={450} radius="var(--radius-lg)" />
        </Container>
      </Box>
    );
  }

  const images =
    product.imageUrls?.length > 0
      ? product.imageUrls.map((url) => getImageUrl(url))
      : [getImageUrl(product.imageUrl)];

  const isFirst = activeIndex === 0;
  const isLast = activeIndex === images.length - 1;

  const avgRating =
    reviews.length > 0
      ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length
      : 0;

  const outOfStock = product.stockQuantity === 0;

  const sortedReviews = [...reviews].sort((a, b) => {
    if (sort === "newest") return new Date(b.createdAt) - new Date(a.createdAt);
    if (sort === "highest") return b.rating - a.rating;
    if (sort === "lowest") return a.rating - b.rating;
    return 0;
  });

  return (
    <Box style={{ background: "var(--bg-primary)", minHeight: "100vh", padding: "18px 0 32px" }}>
    <Container size="lg" my="xl">
      <Grid gutter="xl">

        {/* IMAGE */}
        <Grid.Col span={{ base: 12, md: 6 }}>
          <Paper
            shadow="md"
            radius="lg"
            p="sm"
            withBorder
            style={{ borderColor: "var(--border)", borderRadius: "var(--radius-lg)", background: "var(--bg-card)" }}
          >

            <div
              onClick={() => setFullscreen(!fullscreen)}
              style={{
                width: "100%",
                aspectRatio: "1 / 1",
                height: fullscreen ? "80vh" : "auto",
                position: "relative",
                overflow: "hidden",
                cursor: "zoom-in",
                borderRadius: "var(--radius-md)",
              }}
              onMouseEnter={() => setIsZooming(true)}
              onMouseLeave={() => setIsZooming(false)}
              onMouseMove={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const x = ((e.clientX - rect.left) / rect.width) * 100;
                const y = ((e.clientY - rect.top) / rect.height) * 100;
                setZoomPos({ x, y });
              }}
            >
              <Carousel
                withIndicators
                onSlideChange={setActiveIndex}
                withControls={images.length > 1}
                previousControlProps={{
                  style: {
                    opacity: isFirst ? 0.3 : 1,
                    pointerEvents: isFirst ? "none" : "auto",
                    background: "var(--primary)",
                    color: "#fff",
                  },
                }}
                nextControlProps={{
                  style: {
                    opacity: isLast ? 0.3 : 1,
                    pointerEvents: isLast ? "none" : "auto",
                    background: "var(--primary)",
                    color: "#fff",
                  },
                }}
              >
                {images.map((img, i) => (
                  <Carousel.Slide key={i}>
                    <Image
                      src={img || undefined}
                      fit="contain"
                      style={{ maxHeight: "100%" }}
                    />
                  </Carousel.Slide>
                ))}
              </Carousel>
            </div>

          </Paper>
        </Grid.Col>

        {/* RIGHT */}
        <Grid.Col span={{ base: 12, md: 6 }}>
          {isZooming ? (
            <Paper p="sm" style={{ height: 450, borderRadius: "var(--radius-lg)" }}>
              <div
                style={{
                  width: "100%",
                  height: "100%",
                  backgroundImage: `url(${images[activeIndex]})`,
                  backgroundSize: "180%",
                  backgroundPosition: `${zoomPos.x}% ${zoomPos.y}%`,
                  borderRadius: "var(--radius-md)",
                }}
              />
            </Paper>
          ) : (
            <Paper
              p="lg"
              withBorder
              style={{ borderColor: "var(--border)", borderRadius: "var(--radius-lg)", background: "var(--bg-card)" }}
            >
              <Stack gap="sm">

                <Title order={2} style={{ color: "var(--text-primary)", lineHeight: 1.2 }}>{product.name}</Title>

                {product.categoryName && (
                  <Badge style={{ borderRadius: "var(--radius-pill)", background: "var(--secondary)", color: "#fff" }}>
                    {product.categoryName}
                  </Badge>
                )}

                <Group>
                  <Rating value={avgRating} readOnly />
                  <Text size="sm">({reviews.length})</Text>
                </Group>

                <Text fw={800} size="xl" c="var(--primary)">{product.price} QAR</Text>

                <Text c="var(--text-primary)">{product.description}</Text>

                <Text c="var(--text-secondary)">Stock: {product.stockQuantity}</Text>

                <Button
                  onClick={handleAddToCart}
                  disabled={outOfStock || added}
                  fullWidth
                  radius="xl"
                  style={{
                    background: outOfStock ? "#9aa2ad" : added ? "var(--secondary)" : "var(--primary)",
                    color: "#fff",
                    boxShadow: "var(--shadow-sm)",
                    border: "none",
                    fontWeight: 700,
                  }}
                >
                  {outOfStock
                    ? "Out of Stock"
                    : added
                    ? "Added ✓"
                    : "Add to Cart"}
                </Button>

                <Button
                  variant="light"
                  fullWidth
                  radius="xl"
                  onClick={handleBuy}
                  style={{ color: "var(--text-primary)", fontWeight: 600 }}
                >
                  Buy Now
                </Button>

                <Button
                  variant="outline"
                  fullWidth
                  radius="xl"
                  style={{ color: "var(--text-primary)", borderColor: "var(--border)", fontWeight: 600 }}
                  onClick={() =>
                    reviewRef.current.scrollIntoView({
                      behavior: "smooth",
                    })
                  }
                >
                  Write Review
                </Button>

              </Stack>
            </Paper>
          )}
        </Grid.Col>
      </Grid>

      {/* REVIEWS */}
      <div ref={reviewRef}>
        <Divider my="xl" label="Customer Reviews" />

        <Title order={3} mb="sm" c="var(--text-primary)">Customer Reviews</Title>

        {reviews.length === 0 && (
          <Text c="var(--text-secondary)">No reviews yet</Text>
        )}

        <Select
          value={sort}
          onChange={setSort}
          data={[
            { value: "newest", label: "Newest" },
            { value: "highest", label: "Highest" },
            { value: "lowest", label: "Lowest" },
          ]}
          mb="md"
          styles={{ input: { borderRadius: "var(--radius-md)", borderColor: "var(--border)" } }}
        />

        {token && (
          <Paper p="md" withBorder style={{ borderColor: "var(--border)", borderRadius: "var(--radius-lg)" }}>
            <Stack>
              <Rating value={rating} onChange={setRating} />
              <Textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                styles={{ input: { borderRadius: "var(--radius-md)", borderColor: "var(--border)" } }}
              />

              <Group>
                <Button onClick={handleSubmitReview} radius="xl" style={{ background: "var(--primary)", color: "#fff" }}>
                  {myReview ? "Update" : "Submit"}
                </Button>

                {myReview && (
                  <Button color="red" radius="xl" onClick={handleDeleteReview}>
                    Delete
                  </Button>
                )}
              </Group>
            </Stack>
          </Paper>
        )}

        <Stack mt="lg">
          {sortedReviews.map((r) => (
            <Paper key={r.id} p="md" withBorder style={{ borderColor: "var(--border)", borderRadius: "var(--radius-lg)" }}>
              <Group justify="space-between">
                <Group>
                  <Text fw={600}>{r.userName}</Text>
                  {r.userName === myReview?.userName && (
                    <Badge size="xs" style={{ borderRadius: "var(--radius-pill)", background: "var(--primary)", color: "#fff" }}>You</Badge>
                  )}
                </Group>
                <Rating value={r.rating} readOnly />
              </Group>

              <Text size="xs" c="var(--text-secondary)">
                {new Date(r.createdAt).toLocaleString()}
              </Text>

              <Text c="var(--text-primary)">{r.comment}</Text>
            </Paper>
          ))}
        </Stack>
      </div>
    </Container>
    </Box>
  );
}