import {
  Group,
  Button,
  Container,
  Text,
  Badge,
  Box,
  Menu,
  Divider,
  Tooltip,
  ActionIcon,
  Drawer,
  Burger,
  Stack,
  Accordion,
} from "@mantine/core";

import {
  IconShoppingCart,
  IconBrandWhatsapp,
  IconMail,
  IconBrandTelegram,
  IconSettings,
  IconHome,
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

  const go = (path) => {
    navigate(path);
    setOpened(false);
  };

  return (
    <>
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
            height: 80,
          }}
        >
          <Text
            fw={800}
            size="lg"
            style={{ cursor: "pointer" }}
            onClick={() => navigate("/")}
          >
            3D Market
          </Text>

          {/* DESKTOP */}
          <Group gap="sm" visibleFrom="sm">

            <Button variant="subtle" onClick={() => navigate("/")}>
              Explore Products
            </Button>

            {/* CART */}
            

            {/* CONTACT */}
            {token && role !== "ADMIN" && (
            <Menu shadow="lg" width={220} radius="md" withArrow>
              <Menu.Target>
                <Button variant="subtle">Contact</Button>
              </Menu.Target>

              <Menu.Dropdown>
                <Menu.Item leftSection={<IconBrandWhatsapp size={16} />}>
                  WhatsApp
                </Menu.Item>
                <Menu.Item leftSection={<IconMail size={16} />}>
                  Email
                </Menu.Item>
                <Menu.Item leftSection={<IconBrandTelegram size={16} />}>
                  Telegram
                </Menu.Item>
              </Menu.Dropdown>
            </Menu>)}

            {!token && (
              <>
                <Button variant="outline" onClick={() => navigate("/login")}>
                  Login
                </Button>
                <Button variant="outline" onClick={() => navigate("/register")}>
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
              
              <Button color="red" variant="outline" onClick={logout}>
                Logout
              </Button>
            )}
          </Group>

          <Burger opened={opened} onClick={() => setOpened((o) => !o)} hiddenFrom="sm" />
        </Container>
      </Box>

      {/* MOBILE DRAWER */}
      <Drawer opened={opened} onClose={() => setOpened(false)} padding="lg" size="80%">
        <Stack>

          <Button onClick={() => go("/")}>Home</Button>
          

          {token && role === "ADMIN" && (
            <Button onClick={() => go("/admin/control-center")}>
              Admin Panel
            </Button>
          )}

          {!token && (
            <>
              <Button onClick={() => go("/login")}>Login</Button>
              <Button onClick={() => go("/register")}>Register</Button>
            </>
          )}

          {token && (
            <>
            <Button onClick={() => go("/cart")}>
            Cart ({totalItems})
          </Button>
          <Button color="red" onClick={logout}>
              Logout
            </Button></>
            
          )}

        </Stack>
      </Drawer>
    </>
  );
}