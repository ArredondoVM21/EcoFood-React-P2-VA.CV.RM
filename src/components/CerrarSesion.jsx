import { signOut } from "firebase/auth";
import { auth } from "../services/firebase";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

export default function CerrarSesion() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      Swal.fire("Sesión cerrada", "Has cerrado sesión correctamente", "success");
      navigate("/login");
    } catch (error) {
      console.error("Error al cerrar sesión:", error); // Esto evita el warning de ESLint
      Swal.fire("Error", "No se pudo cerrar la sesión", "error");
    }
  };

  return (
    <button onClick={handleLogout} className="btn btn-danger">
      Cerrar Sesión
    </button>
  );
}
