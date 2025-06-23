import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Navigate } from "react-router-dom";

export default function ProtectedByRole({ children, allowed }) {
  const { userData, loading } = useContext(AuthContext);

  if (loading) {
    return <div>Cargando...</div>;
  }

  if (!userData || !allowed.includes(userData.tipo)) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
