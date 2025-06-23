import { useState } from "react";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../services/firebase";
import Swal from "sweetalert2";
import { Link } from "react-router-dom";

export default function RecuperarContrasena() {
  const [email, setEmail] = useState("");

  const handleResetPassword = async (e) => {
    e.preventDefault();

    const trimmedEmail = email.trim();

    if (!trimmedEmail) {
      return Swal.fire(
        "Campo vacío",
        "Por favor ingresa tu correo electrónico",
        "warning"
      );
    }

    try {
      await sendPasswordResetEmail(auth, trimmedEmail);
      return Swal.fire(
        "Correo enviado",
        "Revisa tu bandeja de entrada o carpeta de spam para restablecer tu contraseña.",
        "success"
      );
    } catch (error) {
      let msg = "Ocurrió un error al enviar el correo.";
      if (error.code === "auth/user-not-found") {
        msg = "No se encontró una cuenta con ese correo.";
      } else if (error.code === "auth/invalid-email") {
        msg = "El correo electrónico ingresado no es válido.";
      }
      Swal.fire("Error", msg, "error");
    }
  };

  return (
    <div className="container mt-5">
      <h2>Recuperar contraseña</h2>
      <form onSubmit={handleResetPassword}>
        <div className="mb-3">
          <label className="form-label">Correo electrónico</label>
          <input
            type="email"
            className="form-control"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            maxLength={60}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary">
          Enviar correo de recuperación
        </button>
      </form>

      <div className="mt-3 text-center">
        <Link to="/login" className="text-decoration-none">
          ← Volver a Iniciar Sesión
        </Link>
      </div>
    </div>
  );
}
