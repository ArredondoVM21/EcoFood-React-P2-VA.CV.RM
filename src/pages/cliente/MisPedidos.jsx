import React, { useEffect, useState } from "react";
import {
  getMisPedidos,
  getProductosDisponibles,
} from "../../services/PedidoService";
import PedidoCard from "../../components/PedidoCard";
import { getFirestore, deleteDoc, doc } from "firebase/firestore";

export default function MisPedidos() {
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function cargarDatos() {
      try {
        const [pedidosData, productosData] = await Promise.all([
          getMisPedidos(),
          getProductosDisponibles(),
        ]);
        const productosMap = {};
        productosData.forEach((prod) => {
          productosMap[prod.id] = {
            nombre: prod.nombre,
            empresaNombre: prod.empresaNombre,
          };
        });
        const enriquecidos = pedidosData.map((p) => ({
          ...p,
          productoNombre:
            productosMap[p.productoId]?.nombre || "Producto desconocido",
          empresaNombre:
            productosMap[p.productoId]?.empresaNombre || "Empresa desconocida",
        }));
        setPedidos(enriquecidos);
      } catch (error) {
        console.error("Error al cargar pedidos:", error);
      } finally {
        setLoading(false);
      }
    }

    cargarDatos();
  }, []);

  const cancelarSolicitud = async (id) => {
    const db = getFirestore();
    if (window.confirm("¿Estás seguro de cancelar esta solicitud?")) {
      try {
        await deleteDoc(doc(db, "solicitudes", id));
        setPedidos(pedidos.filter((p) => p.id !== id));
      } catch (error) {
        console.error("Error al cancelar solicitud:", error);
        alert("Ocurrió un error al cancelar la solicitud.");
      }
    }
  };

  return (
    <div className="p-4">
      <h2>Mis Solicitudes</h2>
      {loading ? (
        <p>Cargando solicitudes...</p>
      ) : pedidos.length === 0 ? (
        <p>No tienes solicitudes aún.</p>
      ) : (
        <div className="grid gap-4">
          {pedidos.map((p) => (
            <PedidoCard
              key={p.id}
              pedido={p}
              onCancelar={() => cancelarSolicitud(p.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
