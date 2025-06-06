import { useEffect, useState } from "react";
import { getUserData, updateUserData } from "../../services/firestore";
import { useAuth } from "../../context/AuthContext";
import Swal from "sweetalert2";

export default function PerfilEmpresa() {
  const { currentUser } = useAuth();
  const [datos, setDatos] = useState({
    nombre: "",
    correo: "",
    ubicacion: "",
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const data = await getUserData(currentUser.uid);
        setDatos({
          nombre: data.nombre || "",
          correo: currentUser.email,
          ubicacion: data.ubicacion || "",
        });
      } catch (error) {
        console.error("Error al cargar perfil:", error);
        Swal.fire("Error", "No se pudo cargar el perfil", "error");
      } finally {
        setLoading(false);
      }
    };

    if (currentUser) {
      cargarDatos();
    }
  }, [currentUser]);

  const handleChange = (e) => {
    setDatos({ ...datos, [e.target.name]: e.target.value });
  };

  const handleGuardar = async (e) => {
    e.preventDefault();

    try {
      await updateUserData(currentUser.uid, {
        nombre: datos.nombre,
        ubicacion: datos.ubicacion,
      });

      Swal.fire("Guardado", "Los datos fueron actualizados correctamente", "success");
    } catch (error) {
      console.error("Error al actualizar datos:", error);
      Swal.fire("Error", "No se pudieron guardar los cambios", "error");
    }
  };

  if (loading) return <div className="container mt-5">Cargando perfil...</div>;

  return (
    <div className="container mt-5">
      <h2>Perfil de Empresa</h2>
      <form onSubmit={handleGuardar}>
        <div className="mb-3">
          <label className="form-label">Nombre de la Empresa</label>
          <input
            type="text"
            className="form-control"
            name="nombre"
            value={datos.nombre}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Correo</label>
          <input
            type="email"
            className="form-control"
            value={datos.correo}
            disabled
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Ubicación</label>
          <input
            type="text"
            className="form-control"
            name="ubicacion"
            value={datos.ubicacion}
            onChange={handleChange}
          />
        </div>
        <button type="submit" className="btn btn-success">
          Guardar Cambios
        </button>
      </form>
    </div>
  );
}
