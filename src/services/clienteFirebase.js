import { db } from "./firebase";
import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";

// ✅ NUEVO: obtener usuarios filtrados por tipo dinámicamente
export const getUsuariosPorTipo = async (tipo) => {
  try {
    const q = query(collection(db, "usuarios"), where("tipo", "==", tipo));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error al obtener usuarios por tipo:", error);
    return [];
  }
};

// obtener todos los usuarios con tipo "cliente"
export const getClientes = async () => {
  try {
    const q = query(collection(db, "usuarios"), where("tipo", "==", "cliente"));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error al obtener clientes:", error);
    return [];
  }
};

// agrega un nuevo cliente con tipo "cliente"
export const addCliente = async (clienteData) => {
  try {
    return await addDoc(collection(db, "usuarios"), {
      ...clienteData,
      tipo: "cliente",
    });
  } catch (error) {
    console.error("Error al agregar cliente:", error);
    throw error;
  }
};

// actualiza un cliente existente por ID
export const updateCliente = async (id, clienteData) => {
  try {
    const ref = doc(db, "usuarios", id);
    return await updateDoc(ref, clienteData);
  } catch (error) {
    console.error("Error al actualizar cliente:", error);
    throw error;
  }
};

// eliminar un cliente por ID
export const deleteCliente = async (id) => {
  try {
    const ref = doc(db, "usuarios", id);
    return await deleteDoc(ref);
  } catch (error) {
    console.error("Error al eliminar cliente:", error);
    throw error;
  }
};

// ✅ función para EditarPerfil.jsx
export const updatePerfilCliente = async (id, nuevosDatos) => {
  try {
    const ref = doc(db, "usuarios", id);
    await updateDoc(ref, nuevosDatos);
  } catch (error) {
    console.error("Error al actualizar perfil del cliente:", error);
    throw error;
  }
};
