import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "./firebase";

/**
 * Obtiene los datos del usuario desde Firestore.
 * 1) Intenta en 'usuarios/{uid}'
 * 2) Si no existe, busca en 'empresas/{uid}'
 * 3) Si no existe en ninguna, lanza un error claro
 */
export async function getUserData(uid) {
  try {
    const userRef = doc(db, "usuarios", uid);
    const userSnap = await getDoc(userRef);
    if (userSnap.exists()) {
      const datosUser = userSnap.data();
      if (!datosUser.tipo) {
        throw new Error(
          "El usuario no tiene definido su campo 'tipo' en Firestore."
        );
      }
      return {
        ...datosUser,
        tipo: datosUser.tipo,
      };
    }

    const empresaRef = doc(db, "empresas", uid);
    const empresaSnap = await getDoc(empresaRef);
    if (empresaSnap.exists()) {
      const datosEmpresa = empresaSnap.data();
      return {
        ...datosEmpresa,
        tipo: datosEmpresa.tipo || "empresa",
      };
    }

    throw new Error("No se encontraron datos del usuario en Firestore.");
  } catch (error) {
    console.error("Error al obtener datos del usuario:", error);
    throw error;
  }
}

/**
 * Actualiza los datos del usuario en Firestore.
 * Busca en 'usuarios/{uid}' o en 'empresas/{uid}' según exista.
 * Lanza un error si no se encuentra el documento.
 */
export async function updateUserData(uid, data) {
  try {
    const userRef = doc(db, "usuarios", uid);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      await updateDoc(userRef, data);
      return;
    }

    const empresaRef = doc(db, "empresas", uid);
    const empresaSnap = await getDoc(empresaRef);

    if (empresaSnap.exists()) {
      await updateDoc(empresaRef, data);
      return;
    }

    throw new Error("No se encontró el documento del usuario para actualizar.");
  } catch (error) {
    console.error("Error al actualizar datos del usuario:", error);
    throw error;
  }
}
