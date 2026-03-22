import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Products from "./pages/Products";
import { AuthProvider } from "./context/AuthContext";
import ProductDetail from "./pages/ProductDetail";
import AdminCreateProduct from "./pages/AdminCreateProduct";
import Register from "./pages/Register";
import ProtectedRoute from "./routes/ProtectedRout";
import Navbar from "./components/Navbar";
import AdminProducts from "./pages/AdminProducts";
import Cart from "./pages/Cart";

// ✅ Mantine
import { AppShell, Text } from "@mantine/core";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppShell
          header={{ height: 60 }}
          footer={{ height: 50 }}
          padding="md"
        >
          {/* 🔝 Navbar */}
          <AppShell.Header>
            <Navbar />
          </AppShell.Header>

          {/* 📄 Main Content */}
          <AppShell.Main>
            <Routes>
              <Route path="/" element={<Products />} />
              <Route path="/login" element={<Login />} />
              <Route path="/products/:id" element={<ProductDetail />} />
              <Route path="/cart" element={<Cart />} />

              <Route
                path="/admin/products"
                element={
                  <ProtectedRoute>
                    <AdminProducts />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/admin/create-product"
                element={
                  <ProtectedRoute>
                    <AdminCreateProduct />
                  </ProtectedRoute>
                }
              />

              <Route path="/register" element={<Register />} />
            </Routes>
          </AppShell.Main>

          {/* 🔻 Footer */}
          <AppShell.Footer>
            <Text ta="center" size="sm" c="dimmed" py="md">
              © {new Date().getFullYear()} Designed and Developed By{" "}
              <strong>Getacher Demisse</strong>
            </Text>
          </AppShell.Footer>
        </AppShell>
      </BrowserRouter>
    </AuthProvider>
  );
}