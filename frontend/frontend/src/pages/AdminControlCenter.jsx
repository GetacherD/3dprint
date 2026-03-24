import {
  Container,
  Title,
  Paper,
  Tabs,
  Stack,
  Text,
  Divider,
  TextInput,
  Textarea,
  Button,
  Group,
  ActionIcon,
  Tooltip,
} from "@mantine/core";

import { IconTrash, IconLock } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import api from "../api/axios";
import { notifications } from "@mantine/notifications";

import AdminProducts from "./AdminProducts";
import AdminCreateProduct from "./AdminCreateProduct";

export default function AdminControlCenter() {
  const [form, setForm] = useState({
    hero_title: "",
    hero_description: "",
    contact_whatsapp: "",
    contact_email: "",
    contact_phone: "",
    contact_telegram: "",
  });

  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState("");
  const [categoryUsage, setCategoryUsage] = useState({});

  const keys = Object.keys(form);

  // 🔥 LOAD ALL
  useEffect(() => {
    const load = async () => {
      try {
        const results = await Promise.all(
          keys.map((k) => api.get(`/api/content/${k}`))
        );

        const data = {};
        keys.forEach((k, i) => {
          data[k] = results[i].data.data || "";
        });

        setForm(data);

        // categories
        const catRes = await api.get("/api/categories");
        setCategories(catRes.data);

        // usage
        const prodRes = await api.get("/api/products?page=0&size=200");

        const counts = {};
        prodRes.data.data.content.forEach((p) => {
          if (p.categoryId) {
            counts[p.categoryId] = (counts[p.categoryId] || 0) + 1;
          }
        });

        setCategoryUsage(counts);

      } catch (err) {
        console.error(err);
      }
    };

    load();
  }, []);

  // 🔥 SAVE CONTENT
  const handleSave = async () => {
    try {
      await Promise.all(
        Object.entries(form).map(([key, value]) =>
          api.put(`/api/content/${key}`, { value })
        )
      );

      notifications.show({
        title: "Saved",
        message: "All settings updated",
        color: "green",
      });
    } catch {
      notifications.show({
        title: "Error",
        message: "Failed to save",
        color: "red",
      });
    }
  };

  // CATEGORY CRUD
  const handleCreateCategory = async () => {
    if (!newCategory) return;

    await api.post("/api/categories", { name: newCategory });
    setNewCategory("");

    const res = await api.get("/api/categories");
    setCategories(res.data);
  };

  const handleUpdateCategory = async (id, name) => {
    await api.put(`/api/categories/${id}`, { name });
  };

  const handleDeleteCategory = async (id) => {
    if (categoryUsage[id] > 0) return;

    await api.delete(`/api/categories/${id}`);
    setCategories((prev) => prev.filter((c) => c.id !== id));
  };

  return (
    <Container size="lg" my="xl">
      <Title order={1} mb={4} c="var(--text-primary)">Admin Control Center</Title>
      <Text size="sm" c="dimmed" mb="lg">
        Manage storefront content, categories, and product catalog from one place.
      </Text>

      <Paper
        p={{ base: "md", sm: "lg" }}
        withBorder
        radius="var(--radius-lg)"
        style={{
          borderColor: "var(--border)",
          background: "var(--bg-card)",
          boxShadow: "var(--shadow-sm)",
        }}
      >

        <Tabs defaultValue="hero" variant="pills" radius="xl">

          <Tabs.List grow style={{ borderBottom: "1px solid var(--border)", marginBottom: 10, paddingBottom: 10 }}>
            <Tabs.Tab value="hero">Hero</Tabs.Tab>
            <Tabs.Tab value="contact">Contact</Tabs.Tab>
            <Tabs.Tab value="category">Categories</Tabs.Tab>
            <Tabs.Tab value="create">Create Product</Tabs.Tab>
            <Tabs.Tab value="products">Update Products</Tabs.Tab>

          </Tabs.List>

          {/* 🔥 HERO FULL */}
          <Tabs.Panel value="hero" pt="md">
            <Paper withBorder p="md" radius="var(--radius-md)" style={{ borderColor: "var(--border)", background: "#fff" }}>
            <Stack>
              <Text fw={700} c="var(--text-primary)">Hero Section Content</Text>
              <Divider color="var(--border)" />

              <Textarea
                label="Hero Title"
                value={form.hero_title}
                onChange={(e) =>
                  setForm({ ...form, hero_title: e.target.value })
                }
                styles={{ input: { borderRadius: "var(--radius-md)", borderColor: "var(--border)" } }}
              />

              <Textarea
                label="Hero Description"
                value={form.hero_description}
                onChange={(e) =>
                  setForm({ ...form, hero_description: e.target.value })
                }
                minRows={4}
                styles={{ input: { borderRadius: "var(--radius-md)", borderColor: "var(--border)" } }}
              />

            </Stack>
            </Paper>
          </Tabs.Panel>

          {/* 🔥 CONTACT FULL */}
          <Tabs.Panel value="contact" pt="md">
            <Paper withBorder p="md" radius="var(--radius-md)" style={{ borderColor: "var(--border)", background: "#fff" }}>
            <Stack>
              <Text fw={700} c="var(--text-primary)">Contact Information</Text>
              <Divider color="var(--border)" />

              <TextInput
                label="WhatsApp"
                value={form.contact_whatsapp}
                onChange={(e) =>
                  setForm({ ...form, contact_whatsapp: e.target.value })
                }
                styles={{ input: { borderRadius: "var(--radius-md)", borderColor: "var(--border)" } }}
              />

              <TextInput
                label="Email"
                value={form.contact_email}
                onChange={(e) =>
                  setForm({ ...form, contact_email: e.target.value })
                }
                styles={{ input: { borderRadius: "var(--radius-md)", borderColor: "var(--border)" } }}
              />

              <TextInput
                label="Phone"
                value={form.contact_phone}
                onChange={(e) =>
                  setForm({ ...form, contact_phone: e.target.value })
                }
                styles={{ input: { borderRadius: "var(--radius-md)", borderColor: "var(--border)" } }}
              />

              <TextInput
                label="Telegram"
                value={form.contact_telegram}
                onChange={(e) =>
                  setForm({ ...form, contact_telegram: e.target.value })
                }
                styles={{ input: { borderRadius: "var(--radius-md)", borderColor: "var(--border)" } }}
              />

            </Stack>
            </Paper>
          </Tabs.Panel>

          {/* 🔥 CATEGORY */}
          <Tabs.Panel value="category" pt="md">
            <Paper withBorder p="md" radius="var(--radius-md)" style={{ borderColor: "var(--border)", background: "#fff" }}>
            <Stack>
              <Text fw={700} c="var(--text-primary)">Category Management</Text>
              <Divider color="var(--border)" />

              <Group align="flex-end" wrap="wrap">
                <TextInput
                  placeholder="New category"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  styles={{ input: { borderRadius: "var(--radius-md)", borderColor: "var(--border)" } }}
                />
                <Button radius="xl" onClick={handleCreateCategory} style={{ background: "var(--primary)", color: "#fff", fontWeight: 700 }}>Add</Button>
              </Group>

              {categories.map((c) => {
                const used = categoryUsage[c.id] > 0;

                return (
                  <Group key={c.id} justify="space-between" align="flex-end" wrap="wrap">

                    <TextInput
                      value={c.name}
                      onChange={(e) => {
                        const val = e.target.value;
                        setCategories((prev) =>
                          prev.map((x) =>
                            x.id === c.id ? { ...x, name: val } : x
                          )
                        );
                      }}
                      styles={{ input: { borderRadius: "var(--radius-md)", borderColor: "var(--border)" } }}
                    />

                    <Group>

                      <Button
                        size="xs"
                        radius="xl"
                        style={{ fontWeight: 600 }}
                        onClick={() => handleUpdateCategory(c.id, c.name)}
                      >
                        Save
                      </Button>

                      {used ? (
                        <Tooltip label={`Used by ${categoryUsage[c.id]} products`}>
                          <ActionIcon color="gray">
                            <IconLock size={16} />
                          </ActionIcon>
                        </Tooltip>
                      ) : (
                        <Tooltip label="Delete">
                          <ActionIcon
                            color="red"
                            onClick={() => handleDeleteCategory(c.id)}
                          >
                            <IconTrash size={16} />
                          </ActionIcon>
                        </Tooltip>
                      )}

                    </Group>

                  </Group>
                );
              })}

            </Stack>
            </Paper>
          </Tabs.Panel>

          {/* PRODUCTS */}
          <Tabs.Panel value="products" pt="md">
            <AdminProducts />
          </Tabs.Panel>

          {/* CREATE */}
          <Tabs.Panel value="create" pt="md">
            <AdminCreateProduct />
          </Tabs.Panel>

        </Tabs>

        <Button fullWidth mt="xl" radius="xl" size="md" onClick={handleSave} style={{ background: "var(--primary)", color: "#fff", boxShadow: "var(--shadow-sm)", fontWeight: 700 }}>
          Save All Changes
        </Button>

      </Paper>
    </Container>
  );
}