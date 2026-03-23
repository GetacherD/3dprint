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

  const [dragging, setDragging] = useState(false);
  const [position, setPosition] = useState(() => {
    const saved = localStorage.getItem("floating-pos");
    return saved ? JSON.parse(saved) : { x: null, y: null };
  });

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

  // 🔥 ACTIONS
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

  const sortedActions = isMobile
    ? [...actions].sort((a) => (a.key === "phone" ? -1 : 1))
    : actions;

  // =========================
  // 🔥 DRAG HANDLERS
  // =========================

  const handleStart = () => {
    setDragging(true);
  };

  const handleMove = (e) => {
    if (!dragging) return;

    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;

    setPosition({
      x: clientX - 30,
      y: clientY - 30,
    });
  };

  const handleEnd = () => {
    if (!dragging) return;
    setDragging(false);

    // 🔥 SNAP TO EDGE
    const screenWidth = window.innerWidth;
    const snapX =
      position.x < screenWidth / 2 ? 20 : screenWidth - 80;

    const snapped = {
      x: snapX,
      y: Math.max(20, Math.min(position.y, window.innerHeight - 120)),
    };

    setPosition(snapped);

    // 🔥 SAVE POSITION
    localStorage.setItem("floating-pos", JSON.stringify(snapped));
  };

  return (
    <Box
      onMouseMove={handleMove}
      onMouseUp={handleEnd}
      onTouchMove={handleMove}
      onTouchEnd={handleEnd}
      style={{
        position: "fixed",
        left: position.x ?? "auto",
        top: position.y ?? "auto",
        right: position.x === null ? 25 : "auto",
        bottom: position.y === null ? 25 : "auto",
        zIndex: 2000,
        touchAction: "none",
      }}
    >
      {/* 🔥 ONLINE BADGE */}
      <Badge
        color="green"
        size="xs"
        style={{
          position: "absolute",
          top: -25,
          right: 4,
        }}
      >
        Online
      </Badge>

      {/* 🔥 ACTIONS */}
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
          animation: dragging ? "none" : "pulse 2s infinite",
          cursor: "grab",
        }}
        onMouseDown={handleStart}
        onTouchStart={handleStart}
        onClick={() => {
          if (!dragging) setOpened((o) => !o);
        }}
      >
        <IconMessageCircle size={28} />
      </ActionIcon>

      {/* 🔥 ANIMATION */}
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