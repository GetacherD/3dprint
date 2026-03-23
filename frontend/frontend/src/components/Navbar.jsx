import {
  Group,
  Button,
  Container,
  Text,
  Badge,
  Box,
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
    <Box
      style={{
        borderBottom: "1px solid #e9ecef",
        background: "white",
        position: "sticky",
        top: 0,
        zIndex: 1000,
      }}
    >
      <Container
        size="lg"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          height: 70,
        }}
      >
        {/* 🔥 LOGO / BRAND */}
        <Text
          fw={800}
          size="lg"
          style={{
            cursor: "pointer",
            letterSpacing: "-0.5px",
          }}
          onClick={() => navigate("/")}
        >
          3D Market
        </Text>

        {/* 🔥 RIGHT SIDE */}
        <Group>

          <Button variant="subtle" onClick={() => navigate("/")}>
            Home
          </Button>

          {/* 🛒 CART */}
          <Box style={{ position: "relative" }}>
            <Button
              variant="light"
              onClick={() => navigate("/cart")}
              leftSection={<IconShoppingCart size={16} />}
            >
              Cart
            </Button>

            {totalItems > 0 && (
              <Badge
                color="red"
                size="sm"
                style={{
                  position: "absolute",
                  top: -6,
                  right: -6,
                }}
              >
                {totalItems}
              </Badge>
            )}
          </Box>

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

                  <Button variant="light" onClick={() => navigate("/admin/create-product")}>
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
    </Box>
  );
}