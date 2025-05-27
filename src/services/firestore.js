import { doc, getDoc } from "firebase/firestore";
import { db } from "./firebase";

/**
 * Obtiene los datos del usuario desde Firestore (colección 'usuarios')
 * @param {string} uid - UID del usuario en Firebase Auth
 * @returns {Promise<Object>} - Objeto con los datos del usuario (por ejemplo: { tipo: "admin" })
 */
export async function getUserData(uid) {
  const docRef = doc(db, "usuarios", uid);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    return docSnap.data();
  } else {
    throw new Error("No se encontraron datos del usuario en Firestore.");
  }


}
