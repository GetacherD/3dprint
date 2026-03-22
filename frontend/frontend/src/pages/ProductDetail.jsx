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
} from "@mantine/core";
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState, useContext, useRef } from "react";
import api from "../api/axios";
import { AuthContext } from "../context/AuthContext";
import { CartContext } from "../context/CartContext";
import { notifications } from "@mantine/notifications";
import { Carousel } from "@mantine/carousel";
import "@mantine/carousel/styles.css";

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);

  const { token } = useContext(AuthContext);
  const { addToCart } = useContext(CartContext);
  const navigate = useNavigate();

  // 🔥 ZOOM (UNCHANGED)
  const [isZooming, setIsZooming] = useState(false);
  const [zoomPos, setZoomPos] = useState({ x: 50, y: 50 });
  const [activeIndex, setActiveIndex] = useState(0);

  // 🔥 CART FEEDBACK (UNCHANGED)
  const [added, setAdded] = useState(false);

  // 🔥 REVIEW STATE
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
    } catch (err) {
      notifications.show({
        title: "Error",
        message: err.response?.data?.message,
        color: "red",
      });
    }
  };

  const handleDeleteReview = async () => {
    try {
      await api.delete(`/api/reviews/${myReview.id}`);

      notifications.show({
        title: "Deleted",
        message: "Review removed",
        color: "red",
      });

      setMyReview(null);
      setRating(0);
      setComment("");

      loadData();
    } catch {
      notifications.show({
        title: "Error",
        message: "Failed to delete review",
        color: "red",
      });
    }
  };

  if (!product) {
    return (
      <Container size="lg">
        <Skeleton height={450} />
      </Container>
    );
  }

  const images =
    product.imageUrls?.length > 0
      ? product.imageUrls
      : [product.imageUrl];

  const isFirst = activeIndex === 0;
  const isLast = activeIndex === images.length - 1;

  // 🔥 SORTED REVIEWS
  const sortedReviews = [...reviews].sort((a, b) => {
    if (sort === "newest") {
      return new Date(b.createdAt) - new Date(a.createdAt);
    }
    if (sort === "highest") {
      return b.rating - a.rating;
    }
    if (sort === "lowest") {
      return a.rating - b.rating;
    }
    return 0;
  });

  return (
    <Container size="lg" my="xl">
      <Grid gutter="xl">

        {/* LEFT IMAGE */}
        <Grid.Col span={{ base: 12, md: 6 }}>
          <Paper shadow="md" radius="lg" p="sm" withBorder>

            <div
              style={{
                width: "100%",
                aspectRatio: "1 / 1",
                position: "relative",
                overflow: "hidden",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "#f8f9fa",
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
                nextControlProps={{
                  style: {
                    opacity: isLast ? 0.3 : 1,
                    pointerEvents: isLast ? "none" : "auto",
                  },
                }}
                previousControlProps={{
                  style: {
                    opacity: isFirst ? 0.3 : 1,
                    pointerEvents: isFirst ? "none" : "auto",
                  },
                }}
              >
                {images.map((img, index) => (
                  <Carousel.Slide key={index}>
                    <div
                      style={{
                        width: "100%",
                        height: "100%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Image
                        src={`http://localhost:8080${img}`}
                        style={{
                          maxWidth: "100%",
                          maxHeight: "100%",
                          objectFit: "contain",
                        }}
                      />
                    </div>
                  </Carousel.Slide>
                ))}
              </Carousel>
            </div>

          </Paper>
        </Grid.Col>

        {/* RIGHT SIDE */}
        <Grid.Col span={{ base: 12, md: 6 }}>
          {isZooming ? (
            <Paper
              shadow="md"
              radius="lg"
              p="sm"
              withBorder
              style={{ height: 450 }}
            >
              <div
                style={{
                  width: "100%",
                  height: "100%",
                  backgroundImage: `url(http://localhost:8080${images[activeIndex]})`,
                  backgroundRepeat: "no-repeat",
                  backgroundSize: "180%",
                  backgroundPosition: `${zoomPos.x}% ${zoomPos.y}%`,
                }}
              />
            </Paper>
          ) : (
            <Stack>
              <Title order={2}>{product.name}</Title>

              <Badge size="lg" color="blue">
                {product.price} QAR
              </Badge>

              <Text c="dimmed">{product.description}</Text>

              <Text size="sm">
                Stock: {product.stockQuantity}
              </Text>

              <Button
                onClick={handleAddToCart}
                color={added ? "green" : "blue"}
                disabled={added}
              >
                {added ? "Added ✓" : "Add to Cart"}
              </Button>

              <Button variant="light" onClick={handleBuy}>
                Buy Now
              </Button>

              <Button
                variant="outline"
                onClick={() =>
                  reviewRef.current.scrollIntoView({ behavior: "smooth" })
                }
              >
                Write a Review
              </Button>
            </Stack>
          )}
        </Grid.Col>

      </Grid>

      {/* 🔥 REVIEW SECTION */}
      <div ref={reviewRef}>
        <Divider my="xl" />

        <Title order={3}>Customer Reviews</Title>

        {reviews.length > 0 && (
          <Rating
            value={
              reviews.reduce((s, r) => s + r.rating, 0) /
              reviews.length
            }
            readOnly
          />
        )}

        <Select
          mt="md"
          value={sort}
          onChange={setSort}
          data={[
            { value: "newest", label: "Newest" },
            { value: "highest", label: "Highest rating" },
            { value: "lowest", label: "Lowest rating" },
          ]}
        />

        {token && (
          <Paper withBorder p="md" mt="md">
            <Stack>
              <Rating value={rating} onChange={setRating} />

              <Textarea
                placeholder="Write your review..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />

              <Group>
                <Button onClick={handleSubmitReview}>
                  {myReview ? "Update Review" : "Submit Review"}
                </Button>

                {myReview && (
                  <Button color="red" onClick={handleDeleteReview}>
                    Delete
                  </Button>
                )}
              </Group>
            </Stack>
          </Paper>
        )}

        {!token && (
          <Text mt="md">
            Please login to write a review
          </Text>
        )}

        <Stack mt="md">
          {sortedReviews.map((r) => (
            <Paper key={r.id} p="md" withBorder>

              <Group justify="space-between">
                <Text fw={500}>{r.userName}</Text>
                <Rating value={r.rating} readOnly size="sm" />
              </Group>

              <Text size="xs" c="dimmed" mt="xs">
                {new Date(r.createdAt).toLocaleString()}
              </Text>

              <Text mt="sm">{r.comment}</Text>

            </Paper>
          ))}
        </Stack>
      </div>
    </Container>
  );
}