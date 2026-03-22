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
} from "@mantine/core";
import { useContext } from "react";
import { CartContext } from "../context/CartContext";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { notifications } from "@mantine/notifications";

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
      <Container size="md" my="xl">
        <Title order={3}>Your cart is empty</Title>
      </Container>
    );
  }

  return (
    <Container size="md" my="xl">
      <Title mb="lg">Your Cart</Title>

      <Paper withBorder p="md" radius="lg">
        <Stack>

          {cart.map((item) => (
            <div key={item.id}>
              <Group justify="space-between">

                {/* LEFT */}
                <Group>
                  <Image
                    src={`http://localhost:8080${item.imageUrl}`}
                    width={60}
                    height={60}
                    radius="md"
                  />

                  <div>
                    <Text fw={500}>{item.name}</Text>
                    <Text size="sm" c="dimmed">
                      {item.price} QAR
                    </Text>
                  </div>
                </Group>

                {/* RIGHT */}
                <Group>

                  {/* QUANTITY */}
                  <Group gap="xs">
                    <Button size="xs" onClick={() => decreaseQty(item.id)}>
                      -
                    </Button>

                    <Text>{item.quantity}</Text>

                    <Button size="xs" onClick={() => increaseQty(item.id)}>
                      +
                    </Button>
                  </Group>

                  {/* TOTAL */}
                  <Text fw={500}>
                    {item.price * item.quantity} QAR
                  </Text>

                  {/* REMOVE */}
                  <Button
                    size="xs"
                    color="red"
                    variant="light"
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
            <Text fw={600}>Total</Text>
            <Text fw={700}>{total} QAR</Text>
          </Group>

          {/* ACTIONS */}
          <Group mt="md">
            <Button color="red" variant="light" onClick={clearCart}>
              Clear Cart
            </Button>

            <Button fullWidth onClick={handleCheckout}>
              Checkout
            </Button>
          </Group>

        </Stack>
      </Paper>
    </Container>
  );
}