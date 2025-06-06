import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedByRole({ allowed, children }) {
  const { userData, loading } = useAuth();

  if (loading) return (
    <div className="flex items-center justify-center h-screen">
      <p className="text-lg">Cargando permisos...</p>
    </div>
  );

  if (!userData || !allowed.includes(userData.tipo)) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}