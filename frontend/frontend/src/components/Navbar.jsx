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
      {/* 🔝 NAVBAR */}
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
          <Text fw={800} size="lg" style={{ cursor: "pointer" }} onClick={() => navigate("/")}>
            3D Market
          </Text>

          {/* DESKTOP */}
          <Group gap="xs" visibleFrom="sm">

            <Button variant="subtle" onClick={() => navigate("/")}>
              Home
            </Button>

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

            {/* CONTACT */}
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
            </Menu>

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

            {token && role === "ADMIN" && (
              <>
                <Button variant="subtle" onClick={() => navigate("/admin/products")}>
                  Dashboard
                </Button>

                <Button variant="light" onClick={() => navigate("/admin/create-product")}>
                  Create
                </Button>

                <Tooltip label="Control Center">
                  <ActionIcon
                    variant="subtle"
                    onClick={() => navigate("/admin/control-center")}
                  >
                    <IconSettings size={20} />
                  </ActionIcon>
                </Tooltip>
              </>
            )}

            {token && (
              <Button color="red" variant="outline" onClick={logout}>
                Logout
              </Button>
            )}
          </Group>

          {/* MOBILE BURGER */}
          <Burger
            opened={opened}
            onClick={() => setOpened((o) => !o)}
            hiddenFrom="sm"
          />
        </Container>
      </Box>

      {/* 📱 DRAWER (MOBILE MENU) */}
      <Drawer
        opened={opened}
        onClose={() => setOpened(false)}
        title="Menu"
        padding="md"
        size="80%"
      >
        <Stack>

          <Button variant="subtle" leftSection={<IconHome size={16} />} onClick={() => go("/")}>
            Home
          </Button>

          <Button variant="light" onClick={() => go("/cart")}>
            Cart ({totalItems})
          </Button>

          {/* 🔥 ACCORDION (SMART UX) */}
          <Accordion defaultValue="contact">

            {/* CONTACT */}
            <Accordion.Item value="contact">
              <Accordion.Control>Contact</Accordion.Control>
              <Accordion.Panel>
                <Stack>
                  <Button variant="subtle">WhatsApp</Button>
                  <Button variant="subtle">Email</Button>
                  <Button variant="subtle">Telegram</Button>
                </Stack>
              </Accordion.Panel>
            </Accordion.Item>

            {/* ADMIN */}
            {token && role === "ADMIN" && (
              <Accordion.Item value="admin">
                <Accordion.Control>Admin</Accordion.Control>
                <Accordion.Panel>
                  <Stack>
                    <Button variant="subtle" onClick={() => go("/admin/products")}>
                      Dashboard
                    </Button>
                    <Button variant="light" onClick={() => go("/admin/create-product")}>
                      Create
                    </Button>
                    <Button variant="subtle" onClick={() => go("/admin/control-center")}>
                      Control Center
                    </Button>
                  </Stack>
                </Accordion.Panel>
              </Accordion.Item>
            )}

            {/* ACCOUNT */}
            {!token && (
              <Accordion.Item value="account">
                <Accordion.Control>Account</Accordion.Control>
                <Accordion.Panel>
                  <Stack>
                    <Button variant="outline" onClick={() => go("/login")}>
                      Login
                    </Button>
                    <Button variant="outline" onClick={() => go("/register")}>
                      Register
                    </Button>
                  </Stack>
                </Accordion.Panel>
              </Accordion.Item>
            )}

          </Accordion>

          {token && (
            <Button color="red" variant="outline" onClick={logout}>
              Logout
            </Button>
          )}

        </Stack>
      </Drawer>

      {/* 🔥 MOBILE BOTTOM NAV */}
      <Box
        hiddenFrom="sm"
        style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          background: "white",
          borderTop: "1px solid #e9ecef",
          display: "flex",
          justifyContent: "space-around",
          padding: "8px 0",
          zIndex: 1000,
        }}
      >
        <ActionIcon size="lg" variant="subtle" onClick={() => navigate("/")}>
          <IconHome />
        </ActionIcon>

        <Box style={{ position: "relative" }}>
          <ActionIcon size="lg" variant="subtle" onClick={() => navigate("/cart")}>
            <IconShoppingCart />
          </ActionIcon>

          {totalItems > 0 && (
            <Badge
              size="xs"
              color="red"
              style={{
                position: "absolute",
                top: -4,
                right: -4,
              }}
            >
              {totalItems}
            </Badge>
          )}
        </Box>

        <ActionIcon size="lg" variant="subtle" onClick={() => setOpened(true)}>
          <IconSettings />
        </ActionIcon>
      </Box>
    </>
  );
}