import { useState } from "react";
import { createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth";
import { auth } from "../services/firebase";
import Swal from "sweetalert2";
import { useNavigate, Link } from "react-router-dom";
import { saveUserData } from "../services/userService";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nombre, setNombre] = useState("");
  const [direccion, setDireccion] = useState("");
  const [comuna, setComuna] = useState("");
  const [telefono, setTelefono] = useState("");
  const [mostrarPassword, setMostrarPassword] = useState(false);
  const [tipo, setTipo] = useState("cliente");
  const navigate = useNavigate();

  const comunasCuartaRegion = [
    "La Serena", "Coquimbo", "Andacollo", "Vicuña", "Paihuano", "La Higuera",
    "Ovalle", "Monte Patria", "Combarbalá", "Punitaqui", "Río Hurtado",
    "Illapel", "Salamanca", "Los Vilos", "Canela"
  ];

  const handleRegister = async (e) => {
    e.preventDefault();

    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$#!%*?&]{8,}$/;
    if (!passwordRegex.test(password)) {
      return Swal.fire("Contraseña débil", "La contraseña debe tener al menos 8 caracteres, incluir letras y números.", "warning");
    }

    try {
      const cred = await createUserWithEmailAndPassword(auth, email, password);

      await saveUserData(cred.user.uid, {
        nombre,
        tipo,
        email,
        direccion,
        comuna,
        telefono,
      });

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
      <h2>Bienvenido, crea tu nueva cuenta</h2>
      <form onSubmit={handleRegister}>
        <div className="mb-3">
          <label className="form-label">Nombre completo</label>
          <input
            type="text"
            className="form-control"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            maxLength={50}
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
            maxLength={60}
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
              maxLength={20}
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
            La contraseña debe tener al menos 8 caracteres, mayúsculas y minúsculas, números y al menos un carácter especial.
          </div>
        </div>

        <div className="mb-3">
          <label className="form-label">Dirección</label>
          <input
            type="text"
            className="form-control"
            value={direccion}
            onChange={(e) => setDireccion(e.target.value)}
            maxLength={60}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Comuna</label>
          <select
            className="form-select"
            value={comuna}
            onChange={(e) => setComuna(e.target.value)}
            required
          >
            <option value="">Selecciona una comuna</option>
            {comunasCuartaRegion.map((c, idx) => (
              <option key={idx} value={c}>{c}</option>
            ))}
          </select>
        </div>

        <div className="mb-3">
          <label className="form-label">Teléfono</label>
          <input
            type="tel"
            className="form-control"
            value={telefono}
            onChange={(e) => setTelefono(e.target.value)}
            maxLength={15}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Tipo de usuario</label>
          <select
            className="form-select"
            value={tipo}
            onChange={(e) => setTipo(e.target.value)}
            required
          >
            <option value="cliente">Cliente</option>
            <option value="admin">Administrador</option>
          </select>
        </div>

        <button type="submit" className="btn btn-success">
          Registrarse
        </button>
      </form>

      <div className="mt-3 text-center">
        <Link to="/login" className="text-decoration-none">
          ¿Ya tienes Cuenta? Inicia Sesión
        </Link>
      </div>
    </div>
    
  );
}
