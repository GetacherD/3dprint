import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Products from "./pages/Products";
import { AuthProvider } from "./context/AuthContext";
import ProductDetail from "./pages/ProductDetail";
import AdminCreateProduct from "./pages/AdminCreateProduct";
import Register from "./pages/Register";
import ProtectedRoute from "./routes/ProtectedRout";
import Navbar from "./components/Navbar";
import AdminProducts from "./pages/AdminProducts"; // 🔥 ADD
import Cart from "./pages/Cart";
import Footer from "./components/Footer";

export default function App() {
  return (
    <AuthProvider>
  <BrowserRouter>

    <div
      style={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
      }}
    >

      {/* 🔝 Navbar */}
      <Navbar />

      {/* 📄 Main Content */}
     <div style={{ flex: 1, paddingBottom: "20px" }}>
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
      </div>

      {/* 🔻 Footer */}
      <Footer />

    </div>

  </BrowserRouter>
</AuthProvider>
  );
}