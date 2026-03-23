import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { MantineProvider } from "@mantine/core";
import "@mantine/core/styles.css";
import "@mantine/notifications/styles.css";
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
        primaryColor: "blue",
        defaultRadius: "md",
      }}
    >
       <Notifications
  position="top-center"
  zIndex={10000}
  autoClose={3000}
  containerWidth={500}
  notificationProps={{
    radius: "lg",
    withBorder: true,
    p: "lg",
  }}
  styles={{
    title: {
      fontSize: "30px",
      fontWeight: 900,
    },
    description: {
      fontSize: "20px",
    },
  }}
/>
      <CartProvider>
    <App />
  </CartProvider>
    </MantineProvider>
  </StrictMode>
);