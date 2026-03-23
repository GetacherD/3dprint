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
      <Container size="lg">
        <Skeleton height={450} />
      </Container>
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
    <Container size="lg" my="xl">
      <Grid gutter="xl">

        {/* IMAGE */}
        <Grid.Col span={{ base: 12, md: 6 }}>
          <Paper shadow="md" radius="lg" p="sm" withBorder>

            <div
              onClick={() => setFullscreen(!fullscreen)}
              style={{
                width: "100%",
                aspectRatio: "1 / 1",
                height: fullscreen ? "80vh" : "auto",
                position: "relative",
                overflow: "hidden",
                cursor: "zoom-in",
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
            <Paper p="sm" style={{ height: 450 }}>
              <div
                style={{
                  width: "100%",
                  height: "100%",
                  backgroundImage: `url(${images[activeIndex]})`,
                  backgroundSize: "180%",
                  backgroundPosition: `${zoomPos.x}% ${zoomPos.y}%`,
                }}
              />
            </Paper>
          ) : (
            <Paper p="lg">
              <Stack>

                <Title>{product.name}</Title>

                {product.categoryName && (
                  <Badge>{product.categoryName}</Badge>
                )}

                <Group>
                  <Rating value={avgRating} readOnly />
                  <Text size="sm">({reviews.length})</Text>
                </Group>

                <Text fw={800}>{product.price} QAR</Text>

                <Text>{product.description}</Text>

                <Text>Stock: {product.stockQuantity}</Text>

                <Button
                  onClick={handleAddToCart}
                  disabled={outOfStock || added}
                >
                  {outOfStock
                    ? "Out of Stock"
                    : added
                    ? "Added ✓"
                    : "Add to Cart"}
                </Button>

                <Button variant="light" onClick={handleBuy}>
                  Buy Now
                </Button>

                <Button
                  variant="outline"
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

        <Title order={3}>Customer Reviews</Title>

        {reviews.length === 0 && (
          <Text c="dimmed">No reviews yet</Text>
        )}

        <Select
          value={sort}
          onChange={setSort}
          data={[
            { value: "newest", label: "Newest" },
            { value: "highest", label: "Highest" },
            { value: "lowest", label: "Lowest" },
          ]}
        />

        {token && (
          <Paper p="md">
            <Stack>
              <Rating value={rating} onChange={setRating} />
              <Textarea value={comment} onChange={(e) => setComment(e.target.value)} />

              <Group>
                <Button onClick={handleSubmitReview}>
                  {myReview ? "Update" : "Submit"}
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

        <Stack mt="lg">
          {sortedReviews.map((r) => (
            <Paper key={r.id} p="md">
              <Group justify="space-between">
                <Group>
                  <Text>{r.userName}</Text>
                  {r.userName === myReview?.userName && (
                    <Badge size="xs">You</Badge>
                  )}
                </Group>
                <Rating value={r.rating} readOnly />
              </Group>

              <Text size="xs">
                {new Date(r.createdAt).toLocaleString()}
              </Text>

              <Text>{r.comment}</Text>
            </Paper>
          ))}
        </Stack>
      </div>
    </Container>
  );
}