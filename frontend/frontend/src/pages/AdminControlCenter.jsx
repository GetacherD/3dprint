import {
  Container,
  Title,
  Paper,
  Tabs,
  Stack,
  TextInput,
  Textarea,
  Button,
} from "@mantine/core";
import { useEffect, useState } from "react";
import api from "../api/axios";
import { notifications } from "@mantine/notifications";

export default function AdminControlCenter() {
  const [form, setForm] = useState({
    // HERO
    hero_title: "",
    hero_description: "",

    // CONTACT
    contact_whatsapp: "",
    contact_email: "",
    contact_phone: "",
    contact_telegram: "",
  });

  const keys = Object.keys(form);

  // 🔥 LOAD ALL CONTENT
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
      } catch (err) {
        console.error(err);
      }
    };

    load();
  }, []);

  // 🔥 SAVE ALL
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
    } catch (err) {
      notifications.show({
        title: "Error",
        message: "Failed to save settings",
        color: "red",
      });
    }
  };

  return (
    <Container size="md" my="xl">
      <Title order={2} mb="lg">
        Admin Control Center
      </Title>

      <Paper p="lg" radius="lg" withBorder>

        <Tabs defaultValue="hero">

          {/* 🔥 TAB HEADERS */}
          <Tabs.List>
            <Tabs.Tab value="hero">Hero Section</Tabs.Tab>
            <Tabs.Tab value="contact">Contact</Tabs.Tab>
          </Tabs.List>

          {/* 🔥 HERO TAB */}
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

          {/* 🔥 CONTACT TAB */}
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

        </Tabs>

        {/* 🔥 SAVE BUTTON */}
        <Button fullWidth mt="xl" onClick={handleSave}>
          Save All Changes
        </Button>

      </Paper>
    </Container>
  );
}