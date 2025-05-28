import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children }) {
  const { user } = useAuth();

  if (!user) {
    // no esta autenticado
    return <Navigate to="/login" />;
  }

  if (!user.emailVerified) {
    // autenticado pero correo no verificado
    return (
      <div className="container mt-5">
        <h3>Verifica tu correo electrónico</h3>
        <p>Debes verificar tu correo antes de acceder a esta sección.</p>
      </div>
    );
  }

  // autenticado y correo verificado
  return children;
}
