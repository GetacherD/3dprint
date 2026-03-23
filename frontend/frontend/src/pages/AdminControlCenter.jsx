import {
  Container,
  Title,
  Paper,
  Tabs,
  Stack,
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
      <Title mb="lg">Admin Control Center</Title>

      <Paper p="lg" withBorder>

        <Tabs defaultValue="hero">

          <Tabs.List>
            <Tabs.Tab value="hero">Hero</Tabs.Tab>
            <Tabs.Tab value="contact">Contact</Tabs.Tab>
            <Tabs.Tab value="category">Categories</Tabs.Tab>
            <Tabs.Tab value="create">Create Product</Tabs.Tab>
            <Tabs.Tab value="products">Update Products</Tabs.Tab>

          </Tabs.List>

          {/* 🔥 HERO FULL */}
          <Tabs.Panel value="hero" pt="md">
            <Stack>

              <Textarea
                label="Hero Title"
                value={form.hero_title}
                onChange={(e) =>
                  setForm({ ...form, hero_title: e.target.value })
                }
              />

              <Textarea
                label="Hero Description"
                value={form.hero_description}
                onChange={(e) =>
                  setForm({ ...form, hero_description: e.target.value })
                }
              />

            </Stack>
          </Tabs.Panel>

          {/* 🔥 CONTACT FULL */}
          <Tabs.Panel value="contact" pt="md">
            <Stack>

              <TextInput
                label="WhatsApp"
                value={form.contact_whatsapp}
                onChange={(e) =>
                  setForm({ ...form, contact_whatsapp: e.target.value })
                }
              />

              <TextInput
                label="Email"
                value={form.contact_email}
                onChange={(e) =>
                  setForm({ ...form, contact_email: e.target.value })
                }
              />

              <TextInput
                label="Phone"
                value={form.contact_phone}
                onChange={(e) =>
                  setForm({ ...form, contact_phone: e.target.value })
                }
              />

              <TextInput
                label="Telegram"
                value={form.contact_telegram}
                onChange={(e) =>
                  setForm({ ...form, contact_telegram: e.target.value })
                }
              />

            </Stack>
          </Tabs.Panel>

          {/* 🔥 CATEGORY */}
          <Tabs.Panel value="category" pt="md">
            <Stack>

              <Group>
                <TextInput
                  placeholder="New category"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                />
                <Button onClick={handleCreateCategory}>Add</Button>
              </Group>

              {categories.map((c) => {
                const used = categoryUsage[c.id] > 0;

                return (
                  <Group key={c.id} justify="space-between">

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
                    />

                    <Group>

                      <Button
                        size="xs"
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

        <Button fullWidth mt="xl" onClick={handleSave}>
          Save All Changes
        </Button>

      </Paper>
    </Container>
  );
}