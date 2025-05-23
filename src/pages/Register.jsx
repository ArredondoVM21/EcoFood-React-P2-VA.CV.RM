import { useState } from "react";
import { createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth";
import { auth } from "../services/firebase";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { saveUserData } from "../services/userService";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nombre, setNombre] = useState("");
  const [direccion, setDireccion] = useState("");
  const [comuna, setComuna] = useState("");
  const [telefono, setTelefono] = useState("");
  const [mostrarPassword, setMostrarPassword] = useState(false);
  const tipo = "cliente";
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    // validacion de contraseña robusta (8 caracteres, con letra y número)
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$#!%*?&]{8,}$/;
    if (!passwordRegex.test(password)) {
      return Swal.fire("Contraseña débil", "La contraseña debe tener al menos 8 caracteres, incluir letras y números.", "warning");
    }

    try {
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      
      // guardar datos adicionales
      await saveUserData(cred.user.uid, {
        nombre,
        tipo,
        email,
        direccion,
        comuna,
        telefono,
      });

      // enviar un correo de verificación
      await sendEmailVerification(cred.user);
      
      Swal.fire(
        "Registrado",
        "Usuario creado correctamente. Verifica tu correo electrónico.",
        "success"
      );
      navigate("/login");
    } catch (error) {
      if (error.code === "auth/email-already-in-use") {
        Swal.fire("Error", "Este correo ya está registrado", "error");
      } else {
        Swal.fire("Error", `No se pudo registrar: ${error.message}`, "error");
      }
    }
  };

  return (
    <div className="container mt-5">
      <h2>Registro de Cliente</h2>
      <form onSubmit={handleRegister}>
        <div className="mb-3">
          <label className="form-label">Nombre completo</label>
          <input
            type="text"
            className="form-control"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Correo electrónico</label>
          <input
            type="email"
            className="form-control"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Contraseña</label>
          <div className="input-group">
            <input
              type={mostrarPassword ? "text" : "password"}
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="button"
              className="btn btn-outline-secondary"
              onClick={() => setMostrarPassword(!mostrarPassword)}
              tabIndex={-1}
            >
              {mostrarPassword ? "Ocultar" : "Mostrar"}
            </button>
          </div>
          <div className="form-text">
            Debe tener al menos 8 caracteres, incluir letras y números.
          </div>
        </div>

        <div className="mb-3">
          <label className="form-label">Dirección</label>
          <input
            type="text"
            className="form-control"
            value={direccion}
            onChange={(e) => setDireccion(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Comuna</label>
          <input
            type="text"
            className="form-control"
            value={comuna}
            onChange={(e) => setComuna(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Teléfono</label>
          <input
            type="tel"
            className="form-control"
            value={telefono}
            onChange={(e) => setTelefono(e.target.value)}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Tipo de usuario</label>
          <input
            type="text"
            className="form-control"
            value="cliente"
            readOnly
          />
        </div>

        <button type="submit" className="btn btn-success">
          Registrarse
        </button>
      </form>
    </div>
  );
}
