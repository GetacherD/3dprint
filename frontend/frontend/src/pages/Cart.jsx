import {
  Container,
  Title,
  Paper,
  Group,
  Image,
  Text,
  Button,
  Stack,
  Divider,
  Box,
} from "@mantine/core";
import { useContext } from "react";
import { CartContext } from "../context/CartContext";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { notifications } from "@mantine/notifications";
import { getImageUrl } from "../utils/image";

export default function Cart() {
  const {
    cart,
    removeFromCart,
    clearCart,
    increaseQty,
    decreaseQty,
  } = useContext(CartContext);

  const { token } = useContext(AuthContext);
  const navigate = useNavigate();

  const total = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const handleCheckout = () => {
    if (!token) {
      notifications.show({
        title: "Login required",
        message: "Please login to proceed with checkout",
        color: "yellow",
      });

      navigate("/login");
      return;
    }

    notifications.show({
      title: "Coming soon",
      message: "Checkout flow will be implemented soon",
      color: "blue",
    });
  };

  if (cart.length === 0) {
    return (
      <Box style={{ background: "var(--bg-primary)", minHeight: "70vh", padding: "28px 12px" }}>
        <Container size="md" my="xl">
          <Paper
            withBorder
            p="xl"
            radius="var(--radius-lg)"
            style={{ borderColor: "var(--border)", textAlign: "center" }}
          >
            <Text size="2rem" mb={8}>🛒</Text>
            <Title order={3} c="var(--text-primary)">Your cart is empty</Title>
            <Text c="var(--text-secondary)" mt={8} mb={18}>Start browsing products and add your favorites.</Text>
            <Button radius="xl" onClick={() => navigate("/")} style={{ background: "var(--primary)", color: "#fff", fontWeight: 700 }}>
              Explore products
            </Button>
          </Paper>
        </Container>
      </Box>
    );
  }

  return (
    <Box style={{ background: "var(--bg-primary)", minHeight: "100vh", padding: "16px 0 30px" }}>
    <Container size="md" my="xl">
      <Title mb="lg" c="var(--text-primary)">Your Cart</Title>

      <Paper
        withBorder
        p="md"
        radius="var(--radius-lg)"
        style={{ borderColor: "var(--border)", background: "var(--bg-card)", boxShadow: "var(--shadow-sm)" }}
      >
        <Stack>

          {cart.map((item) => (
            <div key={item.id}>
              <Group justify="space-between" align="flex-start" wrap="wrap">

                {/* LEFT */}
                <Group>
                  <Image
                    src={`${getImageUrl(item.imageUrl)}`}
                    width={68}
                    height={68}
                    radius="var(--radius-md)"
                  />

                  <div>
                    <Text fw={600} c="var(--text-primary)">{item.name}</Text>
                    <Text size="sm" c="var(--text-secondary)">
                      {item.price} QAR
                    </Text>
                  </div>
                </Group>

                {/* RIGHT */}
                <Group wrap="wrap" justify="flex-end" gap="xs">

                  {/* QUANTITY */}
                  <Group gap="xs">
                    <Button size="xs" radius="xl" variant="light" style={{ color: "var(--text-primary)", fontWeight: 700 }} onClick={() => decreaseQty(item.id)}>
                      -
                    </Button>

                    <Text fw={600}>{item.quantity}</Text>

                    <Button size="xs" radius="xl" variant="light" style={{ color: "var(--text-primary)", fontWeight: 700 }} onClick={() => increaseQty(item.id)}>
                      +
                    </Button>
                  </Group>

                  {/* TOTAL */}
                  <Text fw={700} c="var(--primary)">
                    {item.price * item.quantity} QAR
                  </Text>

                  {/* REMOVE */}
                  <Button
                    size="xs"
                    color="red"
                    variant="light"
                    radius="xl"
                    style={{ fontWeight: 600 }}
                    onClick={() => removeFromCart(item.id)}
                  >
                    Remove
                  </Button>

                </Group>

              </Group>

              <Divider my="sm" />
            </div>
          ))}

          {/* TOTAL */}
          <Group justify="space-between" mt="md">
            <Text fw={600} c="var(--text-primary)">Total</Text>
            <Text fw={800} size="lg" c="var(--primary)">{total} QAR</Text>
          </Group>

          {/* ACTIONS */}
          <Group mt="md" grow>
            <Button color="red" variant="light" radius="xl" style={{ fontWeight: 600 }} onClick={clearCart}>
              Clear Cart
            </Button>

            <Button
              fullWidth
              radius="xl"
              onClick={handleCheckout}
              style={{ background: "var(--primary)", color: "#fff", boxShadow: "var(--shadow-sm)", fontWeight: 700 }}
            >
              Checkout
            </Button>
          </Group>

        </Stack>
      </Paper>
    </Container>
    </Box>
  );
}
