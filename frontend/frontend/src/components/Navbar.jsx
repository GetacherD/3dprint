import {
  Group,
  Button,
  Container,
  Text,
  Badge,
  Box,
  Menu,
  Divider,
} from "@mantine/core";
import {
  IconShoppingCart,
  IconBrandWhatsapp,
  IconMail,
  IconBrandTelegram,
} from "@tabler/icons-react";
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
        backdropFilter: "blur(6px)",
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
        {/* LOGO */}
        <Text
          fw={800}
          size="lg"
          style={{ cursor: "pointer" }}
          onClick={() => navigate("/")}
        >
          3D Market
        </Text>

        {/* RIGHT */}
        <Group gap="xs">

          <Button variant="subtle" onClick={() => navigate("/")}>
            Home
          </Button>

          {/* CART */}
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

          {/* 🔥 CONTACT DROPDOWN */}
          <Menu shadow="lg" width={220} radius="md" withArrow>
            <Menu.Target>
              <Button variant="subtle">Contact</Button>
            </Menu.Target>

            <Menu.Dropdown>

              <Menu.Label>Reach Us</Menu.Label>

              <Menu.Item
                leftSection={<IconBrandWhatsapp size={16} color="#25D366" />}
                onClick={() =>
                  window.open(
                    "https://wa.me/974XXXXXXXX?text=Hi%20I%20am%20interested%20in%20your%203D%20products",
                    "_blank"
                  )
                }
              >
                WhatsApp
              </Menu.Item>

              <Menu.Item
                leftSection={<IconMail size={16} />}
                onClick={() =>
                  window.open("mailto:your@email.com", "_blank")
                }
              >
                Email
              </Menu.Item>

              <Menu.Item
                leftSection={<IconBrandTelegram size={16} color="#229ED9" />}
                onClick={() =>
                  window.open("https://t.me/yourusername", "_blank")
                }
              >
                Telegram
              </Menu.Item>

              <Divider my="xs" />

              <Menu.Label>Support</Menu.Label>

              <Menu.Item
                onClick={() =>
                  window.open("mailto:support@yourdomain.com", "_blank")
                }
              >
                Customer Support
              </Menu.Item>

            </Menu.Dropdown>
          </Menu>

          {!token && (
            <>
              <Button onClick={() => navigate("/login")}>Login</Button>
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

                  <Button
                    variant="light"
                    onClick={() => navigate("/admin/create-product")}
                  >
                    Create
                  </Button>
                  <Button onClick={() => navigate("/admin/settings")}>
  Settings
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