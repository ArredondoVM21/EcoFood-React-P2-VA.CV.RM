import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  signInWithEmailAndPassword,
  setPersistence,
  browserLocalPersistence,
} from "firebase/auth";
import { auth } from "../services/firebase";
import Swal from "sweetalert2";
import { getUserData } from "../services/firestore";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    const emailClean = email.trim();
    const passwordClean = password.trim();

    if (!emailClean || !passwordClean) {
      return Swal.fire("Campos vacíos", "Completa todos los campos", "warning");
    }

    try {
      await setPersistence(auth, browserLocalPersistence);
      const cred = await signInWithEmailAndPassword(
        auth,
        emailClean,
        passwordClean
      );

      if (!cred.user.emailVerified) {
        Swal.fire(
          "Verificación requerida",
          "Debes verificar tu correo antes de ingresar.",
          "warning"
        );
        return;
      }

      const datos = await getUserData(cred.user.uid);
      console.log("Datos de usuario:", datos);

      switch (datos.tipo) {
        case "admin":
          navigate("/admin/dashboard", { replace: true });
          break;
        case "cliente":
          navigate("/cliente/dashboard", { replace: true });
          break;
        case "empresa":
          navigate("/empresa/perfil", { replace: true });
          break;
        default:
          Swal.fire("Error", "Tipo de usuario no reconocido", "error");
      }
    } catch (error) {
      console.error("Error en login:", error.code, error.message);
      let mensaje = "Credenciales incorrectas";

      if (error.code === "auth/user-not-found") {
        mensaje = "Usuario no encontrado";
      } else if (error.code === "auth/wrong-password") {
        mensaje = "Contraseña incorrecta";
      } else if (error.code === "auth/invalid-email") {
        mensaje = "Correo inválido";
      }

      Swal.fire("Error", mensaje, "error");
    }
  };

  return (
    <div className="container mt-5">
      <h2>Iniciar Sesión</h2>
      <form onSubmit={handleLogin}>
        <div className="mb-3">
          <label className="form-label">Correo Electrónico</label>
          <input
            type="email"
            className="form-control"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            maxLength={60}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Contraseña</label>
          <input
            type="password"
            className="form-control"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            maxLength={20}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary">
          Iniciar Sesión
        </button>
      </form>
      <div className="mt-3 text-center">
        <Link to="/recuperar" className="text-decoration-none">
          ¿Olvidaste tu contraseña?
        </Link>
      </div>
    </div>
  );
}
