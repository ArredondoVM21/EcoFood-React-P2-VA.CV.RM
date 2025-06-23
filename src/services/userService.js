import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "./firebase";

/**
 * Obtiene los datos del usuario desde Firestore.
 * Busca en la colección 'usuarios' usando el UID del usuario.
 *
 * @param {string} uid - ID del usuario autenticado (auth.uid)
 * @returns {Promise<Object>} - Objeto con los datos del usuario
 * @throws {Error} - Si no se encuentra el usuario o hay un error en Firestore
 */
export const getUserData = async (uid) => {
  try {
    const ref = doc(db, "usuarios", uid);
    const snapshot = await getDoc(ref);
    if (snapshot.exists()) {
      return snapshot.data();
    } else {
      throw new Error("Usuario no encontrado en Firestore.");
    }
  } catch (error) {
    console.error("Error al obtener datos del usuario:", error);
    throw error;
  }
};

/**
 * Guarda los datos del usuario en Firestore al momento de registrarse.
 * Escribe en la colección 'usuarios' con el UID del usuario.
 *
 * @param {string} uid - ID del usuario autenticado (auth.uid)
 * @param {Object} data - Objeto con los datos del usuario (nombre, tipo, email, etc.)
 * @returns {Promise<void>}
 * @throws {Error} - Si ocurre un error al guardar en Firestore
 */
export const saveUserData = async (uid, data) => {
  try {
    await setDoc(doc(db, "usuarios", uid), data);
  } catch (error) {
    console.error("Error al guardar usuario:", error);
    throw error;
  }
};
