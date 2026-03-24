import {
  Group,
  Button,
  Container,
  Text,
  Badge,
  Box,
  Menu,
  Tooltip,
  Drawer,
  Burger,
  Stack,
  Flex,
} from "@mantine/core";

import {
  IconShoppingCart,
  IconBrandWhatsapp,
  IconMail,
  IconBrandTelegram,
  IconSettings,
} from "@tabler/icons-react";

import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { CartContext } from "../context/CartContext";
import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const { token, role, logout } = useContext(AuthContext);
  const { cart } = useContext(CartContext);

  const navigate = useNavigate();
  const [opened, setOpened] = useState(false);

  const totalItems = cart.reduce((sum, i) => sum + i.quantity, 0);
  const mobileHeaderOffset = 72; // sticky navbar height

  const go = (path) => {
    navigate(path);
    setOpened(false);
  };

  return (
    <>
      <Box
        style={{
          borderBottom: "1px solid var(--border)",
          background: "rgba(255,255,255,0.95)",
          backdropFilter: "blur(10px)",
          position: "sticky",
          top: 0,
          zIndex: 1000,
          boxShadow: "var(--shadow-sm)",
        }}
      >
        <Container
          size="lg"
          className="navbar-shell"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            height: 72,
          }}
        >
          <Flex className="navbar-brand" align="center" gap={10} style={{ cursor: "pointer" }} onClick={() => navigate("/")}>
            <Box
              style={{
                width: 34,
                height: 34,
                borderRadius: "var(--radius-md)",
                background: "linear-gradient(135deg, var(--primary), var(--accent))",
                color: "#fff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 18,
                boxShadow: "var(--shadow-sm)",
              }}
            >
              ✨
            </Box>
            <Text className="navbar-brand-text" fw={800} size="lg" c="var(--text-primary)">
              3D Market
            </Text>
          </Flex>

          {/* DESKTOP */}
          <Group gap="xs" className="desktop-nav-actions" visibleFrom="sm">

            <Button
              variant="subtle"
              radius="xl"
              style={{ color: "var(--text-primary)", fontWeight: 600 }}
              onClick={() => navigate("/")}
            >
              Explore Products
            </Button>

            {/* CART */}
            

            {/* CONTACT */}
            {token && role !== "ADMIN" && (
            <Menu shadow="lg" width={220} radius="md" withArrow>
              <Menu.Target>
                <Button variant="subtle" radius="xl" style={{ color: "var(--text-primary)", fontWeight: 600 }}>
                  Contact
                </Button>
              </Menu.Target>

              <Menu.Dropdown>
                <Menu.Item c="var(--text-primary)" leftSection={<IconBrandWhatsapp size={16} />}>
                  WhatsApp
                </Menu.Item>
                <Menu.Item c="var(--text-primary)" leftSection={<IconMail size={16} />}>
                  Email
                </Menu.Item>
                <Menu.Item c="var(--text-primary)" leftSection={<IconBrandTelegram size={16} />}>
                  Telegram
                </Menu.Item>
              </Menu.Dropdown>
            </Menu>)}

            {!token && (
              <>
                <Button
                  variant="outline"
                  radius="xl"
                  onClick={() => navigate("/login")}
                  style={{
                    color: "var(--text-primary)",
                    borderColor: "var(--border)",
                    background: "#fff",
                  }}
                >
                  Login
                </Button>
                <Button
                  onClick={() => navigate("/register")}
                  style={{
                    borderRadius: "var(--radius-pill)",
                    background: "var(--primary)",
                    color: "#fff",
                    boxShadow: "var(--shadow-sm)",
                  }}
                >
                  Register
                </Button>
              </>
            )}

            {/* 🔥 ADMIN SIMPLIFIED */}
            {token && role === "ADMIN" && (
              <Tooltip
  label="Admin Control Center"
  position="bottom"
  withArrow
  zIndex={1000}
  withinPortal
>
  <Button
    variant="light"
    onClick={() => navigate("/admin/control-center")}
    leftSection={<IconSettings size={16} />}
    radius="xl"
    style={{ color: "var(--text-primary)", fontWeight: 600 }}
  >
    Admin
  </Button>
</Tooltip>
            )}


 {token && role!=="ADMIN" && (
              
              <Box style={{ position: "relative" }}>
              <Button
                variant="light"
                onClick={() => navigate("/cart")}
                leftSection={<IconShoppingCart size={16} />}
                radius="xl"
                style={{ color: "var(--text-primary)", fontWeight: 600 }}
              >
                Cart
              </Button>

              {totalItems > 0 && (
                <Badge
                  color="red"
                  size="sm"
                  style={{ position: "absolute", top: -6, right: -6 }}
                >
                  {totalItems}
                </Badge>
              )}
            </Box>
              
            )}
            {token && (
              
              <Button color="red" variant="outline" radius="xl" onClick={logout}>
                Logout
              </Button>
            )}
          </Group>

          <Group className="mobile-nav-actions" gap="xs" wrap="nowrap" hiddenFrom="sm">
            <Button
              radius="xl"
              size="xs"
              variant="light"
              onClick={() => navigate("/")}
              style={{
                color: "var(--text-primary)",
                fontWeight: 700,
                border: "1px solid var(--border)",
                background: "#fff",
              }}
            >
              Explore
            </Button>
            <Burger opened={opened} onClick={() => setOpened((o) => !o)} />
          </Group>
        </Container>
      </Box>

      {/* MOBILE DRAWER */}
      <Drawer
        opened={opened}
        onClose={() => setOpened(false)}
        padding="lg"
        size="90%"
        title={<Text fw={700}>Menu</Text>}
        styles={{
          header: {
            borderBottom: "1px solid var(--border)",
          },
          body: {
            paddingTop: 14,
          },
          content: {
            marginTop: mobileHeaderOffset,
            height: `calc(100dvh - ${mobileHeaderOffset}px)`,
            borderTopRightRadius: "var(--radius-lg)",
            borderBottomRightRadius: "var(--radius-lg)",
          },
        }}
      >
        <Stack gap="sm">

          <Button radius="xl" variant="light" fullWidth onClick={() => go("/")}>Home</Button>
          

          {token && role === "ADMIN" && (
            <Button radius="xl" variant="light" fullWidth onClick={() => go("/admin/control-center")}>
              Admin Panel
            </Button>
          )}

          {!token && (
            <>
              <Button
                radius="xl"
                variant="light"
                onClick={() => go("/login")}
                style={{ color: "var(--text-primary)", background: "#fff", border: "1px solid var(--border)" }}
              >
                Login
              </Button>
              <Button
                radius="xl"
                onClick={() => go("/register")}
                style={{ background: "var(--primary)", color: "#fff" }}
                fullWidth
              >
                Register
              </Button>
            </>
          )}

          {token && (
            <>
            <Button radius="xl" variant="light" fullWidth onClick={() => go("/cart")}>
            Cart ({totalItems})
          </Button>
          <Button color="red" radius="xl" fullWidth onClick={logout}>
              Logout
            </Button></>
            
          )}

        </Stack>
      </Drawer>
    </>
  );
}