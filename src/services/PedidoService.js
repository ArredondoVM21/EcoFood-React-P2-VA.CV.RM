import { db } from "./firebase";
import { collection, getDocs, addDoc } from "firebase/firestore";

export async function getProductosDisponibles() {
  const snapshot = await getDocs(collection(db, "productos"));
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
}

export async function solicitarProducto({
  clienteId,
  productoId,
  empresaId,
  cantidad,
}) {
  return addDoc(collection(db, "solicitudes"), {
    clienteId,
    productoId,
    empresaId,
    cantidadSolicitada: cantidad,
    fecha: new Date().toISOString().split("T")[0],
    estado: "pendiente",
  });
}

export async function getMisPedidos() {
  // Aquí debes filtrar por clienteId del auth
  const snapshot = await getDocs(collection(db, "solicitudes"));
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
}
