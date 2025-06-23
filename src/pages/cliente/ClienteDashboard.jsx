import { useNavigate } from "react-router-dom";

export default function ClienteDashboard() {
  const navigate = useNavigate();

  return (
    <div style={{ padding: "2rem" }}>
      <h2 style={{ marginBottom: "1rem" }}>
        ¡Bienvenido al panel del cliente!
      </h2>
      <p>Selecciona una acción:</p>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "1rem",
          marginTop: "1rem",
          maxWidth: "300px",
        }}
      >
        <button
          onClick={() => navigate("/cliente/productos")}
          style={{ padding: "0.75rem", fontSize: "1rem", cursor: "pointer" }}
        >
          Ver Productos
        </button>
        <button
          onClick={() => navigate("/cliente/pedidos")}
          style={{ padding: "0.75rem", fontSize: "1rem", cursor: "pointer" }}
        >
          Mis Solicitudes
        </button>
        <button
          onClick={() => navigate("/cliente/editar")}
          style={{ padding: "0.75rem", fontSize: "1rem", cursor: "pointer" }}
        >
          Editar Perfil
        </button>
      </div>
    </div>
  );
}
