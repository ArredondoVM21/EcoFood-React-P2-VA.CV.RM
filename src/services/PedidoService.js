import { db, auth } from "./firebase";
import {
  collection,
  getDocs,
  addDoc,
  Timestamp,
  query,
  where,
  getDoc,
  doc,
} from "firebase/firestore";

export async function getProductosDisponibles() {
  try {
    const snapshot = await getDocs(collection(db, "productos"));
    return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
  } catch (error) {
    console.error("Error al obtener productos:", error);
    return [];
  }
}

export async function solicitarProducto({
  clienteId,
  productoId,
  empresaId,
  cantidad,
}) {
  try {
    return await addDoc(collection(db, "solicitudes"), {
      clienteId,
      productoId,
      empresaId,
      cantidadSolicitada: cantidad,
      fecha: Timestamp.now(),
      estado: "pendiente",
    });
  } catch (error) {
    console.error("Error al solicitar producto:", error);
    throw error;
  }
}

export async function getMisPedidos() {
  try {
    const user = auth.currentUser;
    if (!user) throw new Error("Usuario no autenticado");

    const q = query(
      collection(db, "solicitudes"),
      where("clienteId", "==", user.uid)
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
  } catch (error) {
    console.error("Error al obtener pedidos del cliente:", error);
    return [];
  }
}

// Exportar getDoc y doc por si se requieren en el futuro
export { getDoc, doc };
