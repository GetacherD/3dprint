import {
  Group,
  Button,
  Container,
  Text,
  Badge,
} from "@mantine/core";
import { IconShoppingCart } from "@tabler/icons-react";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { CartContext } from "../context/CartContext";
import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const { token, role, logout } = useContext(AuthContext);
  const { cart } = useContext(CartContext);

  const navigate = useNavigate();

  const totalItems = cart.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <Container
      size="lg"
      style={{
        display: "flex",
        justifyContent: "space-between",
        padding: "15px 0",
      }}
    >
      <Text
        fw={700}
        style={{ cursor: "pointer" }}
        onClick={() => navigate("/")}
      >
        3D Print Store
      </Text>

      <Group>

        {/* 🌍 EXPLORE */}
        <Button variant="subtle" onClick={() => navigate("/")}>
          Explore
        </Button>

        {/* 🛒 CART */}
        <Button
          variant="light"
          onClick={() => navigate("/cart")}
          leftSection={<IconShoppingCart size={16} />}
        >
          Cart
          {totalItems > 0 && (
            <Badge ml="xs" color="red">
              {totalItems}
            </Badge>
          )}
        </Button>

        {!token && (
          <>
            <Button onClick={() => navigate("/login")}>
              Login
            </Button>
            <Button variant="outline" onClick={() => navigate("/register")}>
              Register
            </Button>
          </>
        )}

        {token && (
          <>
            {role === "ADMIN" && (
              <>
                <Badge color="red">Admin</Badge>

                <Button onClick={() => navigate("/admin/products")}>
                  Dashboard
                </Button>

                <Button onClick={() => navigate("/admin/create-product")}>
                  Create
                </Button>
              </>
            )}

            <Button color="red" variant="outline" onClick={logout}>
              Logout
            </Button>
          </>
        )}

      </Group>
    </Container>
  );
}