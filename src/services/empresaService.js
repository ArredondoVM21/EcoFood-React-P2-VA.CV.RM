import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db, auth } from "./firebase";

/**
 * Obtiene los datos de la empresa (basado en el uid del usuario autenticado).
 * @returns {Promise<Object>} Objeto con los datos de la empresa (nombre, ubicación, etc.)
 */
export async function getEmpresaData() {
  try {
    const uid = auth.currentUser?.uid;
    if (!uid) throw new Error("Usuario no autenticado");

    const empresaRef = doc(db, "empresas", uid);
    const snap = await getDoc(empresaRef);

    if (!snap.exists()) {
      throw new Error("Perfil de empresa no encontrado.");
    }

    return snap.data();
  } catch (error) {
    console.error("Error al obtener datos de la empresa:", error);
    throw error;
  }
}

/**
 * Actualiza los datos de la empresa. No permite cambiar el correo, solo campos de perfil.
 * @param {Object} nuevosDatos — Objeto con { nombre, rut, direccion, comuna, telefono, ... }
 * @returns {Promise<void>}
 */
export async function updateEmpresaData(nuevosDatos) {
  try {
    const uid = auth.currentUser?.uid;
    if (!uid) throw new Error("Usuario no autenticado");

    const empresaRef = doc(db, "empresas", uid);
    await updateDoc(empresaRef, {
      ...nuevosDatos,
    });
  } catch (error) {
    console.error("Error al actualizar datos de la empresa:", error);
    throw error;
  }
}
