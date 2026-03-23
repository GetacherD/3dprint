import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children, role }) {
  const { token, role: userRole } = useContext(AuthContext);

  if (!token) return <Navigate to="/login" />;

  if (role && userRole !== role) {
    return <Navigate to="/" />;
  }

  return children;
}