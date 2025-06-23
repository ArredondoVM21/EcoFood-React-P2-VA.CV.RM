import { useEffect, useState } from "react";
import { getAuth } from "firebase/auth";
import Swal from "sweetalert2";
import {
  getProductosDisponibles,
  solicitarProducto,
} from "../../services/PedidoService";

export default function VerProductos() {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const auth = getAuth();
  const user = auth.currentUser;

  useEffect(() => {
    async function cargar() {
      try {
        const datos = await getProductosDisponibles();
        setProductos(datos);
      } catch (error) {
        console.error("Error al obtener productos:", error);
        Swal.fire("Error", "No se pudieron cargar los productos", "error");
      } finally {
        setLoading(false);
      }
    }
    cargar();
  }, []);

  const manejarSolicitud = async (producto) => {
    if (!user) {
      return Swal.fire(
        "Error",
        "Debes estar autenticado para solicitar",
        "warning"
      );
    }

    if (producto.stock <= 0) {
      return Swal.fire(
        "Sin stock",
        "Este producto ya no está disponible",
        "warning"
      );
    }

    const { value: cantidad } = await Swal.fire({
      title: `Solicitar ${producto.nombre}`,
      input: "number",
      inputLabel: `Ingresa cantidad (max ${producto.stock})`,
      inputAttributes: {
        min: 1,
        max: producto.stock,
      },
      showCancelButton: true,
      inputValidator: (value) => {
        const cantidadInt = parseInt(value);
        if (
          !value ||
          isNaN(cantidadInt) ||
          cantidadInt < 1 ||
          cantidadInt > producto.stock
        ) {
          return `Ingresa una cantidad válida entre 1 y ${producto.stock}`;
        }
      },
    });

    if (!cantidad) return;

    try {
      await solicitarProducto({
        clienteId: user.uid,
        productoId: producto.id,
        empresaId: producto.empresaId,
        cantidad: parseInt(cantidad),
      });

      Swal.fire("Listo", "Solicitud enviada correctamente", "success");
    } catch (err) {
      console.error("Error al solicitar producto:", err);
      Swal.fire("Error", "No se pudo completar la solicitud", "error");
    }
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Productos disponibles</h2>
      {loading ? (
        <p>Cargando productos...</p>
      ) : (
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "1rem",
            marginTop: "1rem",
          }}
        >
          {productos.map((producto) => (
            <div
              key={producto.id}
              style={{
                border: "1px solid #ccc",
                padding: "1rem",
                width: "250px",
              }}
            >
              <h4>{producto.nombre}</h4>
              <p>Empresa: {producto.empresaNombre}</p>
              <p>Ubicación: {producto.ubicacion}</p>
              <p>
                Precio:{" "}
                {producto.precio > 0 ? `$${producto.precio}` : "Gratuito"}
              </p>
              <p>Stock: {producto.stock}</p>
              <button onClick={() => manejarSolicitud(producto)}>
                Solicitar
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
