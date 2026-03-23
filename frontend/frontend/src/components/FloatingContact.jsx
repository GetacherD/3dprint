import {
  ActionIcon,
  Stack,
  Transition,
  Paper,
  Tooltip,
  Badge,
  Box,
} from "@mantine/core";
import {
  IconBrandWhatsapp,
  IconBrandTelegram,
  IconMail,
  IconPhone,
  IconMessageCircle,
} from "@tabler/icons-react";
import { useEffect, useState } from "react";
import api from "../api/axios";

export default function FloatingContact() {
  const [opened, setOpened] = useState(false);
  const [contact, setContact] = useState({});
  const [isMobile, setIsMobile] = useState(false);

  // 🔥 Detect mobile
  useEffect(() => {
    setIsMobile(window.innerWidth < 768);
  }, []);

  // 🔥 Load contact from backend
  useEffect(() => {
    const load = async () => {
      try {
        const keys = [
          "contact_whatsapp",
          "contact_email",
          "contact_phone",
          "contact_telegram",
        ];

        const results = await Promise.all(
          keys.map((k) => api.get(`/api/content/${k}`))
        );

        const data = {};
        keys.forEach((k, i) => {
          data[k] = results[i].data.data;
        });

        setContact(data);
      } catch (err) {
        console.error("Failed to load contact info", err);
      }
    };

    load();
  }, []);

  const open = (url) => window.open(url, "_blank");

  // 🔥 Build actions dynamically
  const actions = [
    {
      key: "phone",
      icon: <IconPhone size={20} />,
      color: "teal",
      label: "Call",
      action: () => open(`tel:${contact.contact_phone}`),
      show: contact.contact_phone,
    },
    {
      key: "whatsapp",
      icon: <IconBrandWhatsapp size={20} />,
      color: "green",
      label: "WhatsApp",
      action: () =>
        open(
          `https://wa.me/${contact.contact_whatsapp}?text=Hi%20I%20am%20interested%20in%20your%203D%20products`
        ),
      show: contact.contact_whatsapp,
    },
    {
      key: "telegram",
      icon: <IconBrandTelegram size={20} />,
      color: "blue",
      label: "Telegram",
      action: () => open(`https://t.me/${contact.contact_telegram}`),
      show: contact.contact_telegram,
    },
    {
      key: "email",
      icon: <IconMail size={20} />,
      color: "gray",
      label: "Email",
      action: () => open(`mailto:${contact.contact_email}`),
      show: contact.contact_email,
    },
  ];

  // 🔥 Mobile → call first
  const sortedActions = isMobile
    ? [...actions].sort((a) => (a.key === "phone" ? -1 : 1))
    : actions;

  return (
    <Box
      style={{
        position: "fixed",
        bottom: 25,
        right: 25,
        zIndex: 2000,
      }}
    >
      {/* 🔥 ONLINE BADGE */}
      <Badge
        color="green"
        size="xs"
        style={{
          position: "absolute",
          top: -10,
          right: 0,
        }}
      >
        Online
      </Badge>

      {/* 🔥 OPTIONS */}
      <Transition mounted={opened} transition="slide-up" duration={200}>
        {(styles) => (
          <Paper
            style={{
              ...styles,
              marginBottom: 10,
              padding: 10,
              borderRadius: 12,
              boxShadow: "0 8px 20px rgba(0,0,0,0.15)",
            }}
          >
            <Stack gap={8}>
              {sortedActions
                .filter((a) => a.show)
                .map((a, index) => (
                  <Transition
                    key={a.key}
                    mounted={opened}
                    transition="pop"
                    duration={200 + index * 50}
                  >
                    {(s) => (
                      <div style={s}>
                        <Tooltip label={a.label} position="left">
                          <ActionIcon
                            size={40}
                            radius="xl"
                            color={a.color}
                            onClick={a.action}
                          >
                            {a.icon}
                          </ActionIcon>
                        </Tooltip>
                      </div>
                    )}
                  </Transition>
                ))}
            </Stack>
          </Paper>
        )}
      </Transition>

      {/* 🔥 MAIN BUTTON */}
      <ActionIcon
        size={60}
        radius="xl"
        style={{
          backgroundColor: "#4c6ef5",
          color: "white",
          boxShadow: "0 8px 20px rgba(0,0,0,0.2)",
          animation: "pulse 2s infinite",
        }}
        onClick={() => setOpened((o) => !o)}
      >
        <IconMessageCircle size={28} />
      </ActionIcon>

      {/* 🔥 SIMPLE PULSE ANIMATION */}
      <style>
        {`
          @keyframes pulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.08); }
            100% { transform: scale(1); }
          }
        `}
      </style>
    </Box>
  );
}