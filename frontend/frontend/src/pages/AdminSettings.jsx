import {
  Container,
  Title,
  Paper,
  Stack,
  TextInput,
  Button,
} from "@mantine/core";
import { useEffect, useState } from "react";
import api from "../api/axios";
import { notifications } from "@mantine/notifications";

export default function AdminSettings() {
  const [form, setForm] = useState({
    contact_whatsapp: "",
    contact_email: "",
    contact_phone: "",
    contact_telegram: "",
  });

  // 🔥 LOAD DATA
  useEffect(() => {
    const load = async () => {
      try {
        const keys = Object.keys(form);

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

  // 🔥 SAVE
  const handleSave = async () => {
    try {
      await Promise.all(
        Object.entries(form).map(([key, value]) =>
          api.put(`/api/content/${key}`, { value })
        )
      );

      notifications.show({
        title: "Saved",
        message: "Contact settings updated",
        color: "green",
      });
    } catch (err) {
      notifications.show({
        title: "Error",
        message: "Failed to save",
        color: "red",
      });
    }
  };

  return (
    <Container size="sm" my="xl">
      <Title order={2} mb="md">
        Contact Settings
      </Title>

      <Paper p="lg" radius="lg" withBorder>
        <Stack>

          <TextInput
            label="WhatsApp Number"
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
            label="Telegram Username"
            value={form.contact_telegram}
            onChange={(e) =>
              setForm({ ...form, contact_telegram: e.target.value })
            }
          />

          <Button onClick={handleSave}>
            Save Settings
          </Button>

        </Stack>
      </Paper>
    </Container>
  );
}