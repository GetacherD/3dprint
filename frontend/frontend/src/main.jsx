import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { MantineProvider } from "@mantine/core";
import "@mantine/core/styles.css";
import "@mantine/notifications/styles.css";
import "./index.css";
import App from "./App.jsx";
import { Notifications } from "@mantine/notifications";
import { CartProvider } from "./context/CartContext.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <MantineProvider
      defaultColorScheme="light"
      withGlobalStyles
      withNormalizeCSS
      theme={{
        primaryColor: "orange",
        primaryShade: 6,
        defaultRadius: "md",
        fontFamily: "Inter, system-ui, -apple-system, Segoe UI, Roboto, sans-serif",
      }}
    >
      <Notifications
        position="top-center"
        zIndex={10000}
        autoClose={3000}
        containerWidth={420}
        notificationProps={{
          radius: "lg",
          withBorder: true,
          p: "md",
        }}
        styles={{
          title: {
            fontSize: "16px",
            fontWeight: 700,
          },
          description: {
            fontSize: "14px",
          },
        }}
      />
      <CartProvider>
        <App />
      </CartProvider>
    </MantineProvider>
  </StrictMode>
);