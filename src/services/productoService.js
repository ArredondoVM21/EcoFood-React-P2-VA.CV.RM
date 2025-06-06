import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc,
  getDocs, 
  doc, 
  query, 
  where, 
  orderBy 
} from "firebase/firestore";
import { db, auth } from "./firebase";

/**
 * Estructura de un producto:
 * {
 *   nombre: string,
 *   descripcion: string,
 *   vencimiento: string (YYYY-MM-DD),
 *   cantidad: number,
 *   precio: number,
 *   estado: "disponible" | "por vencer" | "gratuito" | ...,
 *   empresaId: string,
 * }
 */

/**
 * Obtiene todos los productos de la empresa actual.
 * @returns {Promise<Array<Object>>} — Lista de productos
 */
export async function getProductosEmpresa() {
  const uid = auth.currentUser.uid;
  const productosRef = collection(db, "productos");
  const q = query(productosRef, where("empresaId", "==", uid), orderBy("vencimiento", "asc"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

/**
 * Crea un nuevo producto para la empresa autenticada.
 * @param {Object} datosProducto — { nombre, descripcion, vencimiento, cantidad, precio, estado }
 * @returns {Promise<void>}
 */
export async function crearProducto(datosProducto) {
  const uid = auth.currentUser.uid;
  const productosRef = collection(db, "productos");
  await addDoc(productosRef, {
    ...datosProducto,
    empresaId: uid,
  });
}

/**
 * Actualiza un producto existente (por su ID).
 * @param {string} productoId 
 * @param {Object} datosActualizados — { nombre, descripcion, vencimiento, cantidad, precio, estado }
 * @returns {Promise<void>}
 */
export async function actualizarProducto(productoId, datosActualizados) {
  const prodRef = doc(db, "productos", productoId);
  await updateDoc(prodRef, {
    ...datosActualizados,
  });
}

/**
 * Elimina un producto por ID.
 * @param {string} productoId 
 * @returns {Promise<void>}
 */
export async function eliminarProducto(productoId) {
  const prodRef = doc(db, "productos", productoId);
  await deleteDoc(prodRef);
}
