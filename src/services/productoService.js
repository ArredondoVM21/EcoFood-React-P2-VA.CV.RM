import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  doc,
  query,
  where,
  orderBy,
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
  try {
    const uid = auth.currentUser?.uid;
    if (!uid) throw new Error("Usuario no autenticado");

    const productosRef = collection(db, "productos");
    const q = query(
      productosRef,
      where("empresaId", "==", uid),
      orderBy("vencimiento", "asc")
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error al obtener productos de la empresa:", error);
    return [];
  }
}

/**
 * Crea un nuevo producto para la empresa autenticada.
 * @param {Object} datosProducto — { nombre, descripcion, vencimiento, cantidad, precio, estado }
 * @returns {Promise<void>}
 */
export async function crearProducto(datosProducto) {
  try {
    const uid = auth.currentUser?.uid;
    if (!uid) throw new Error("Usuario no autenticado");

    const productosRef = collection(db, "productos");
    await addDoc(productosRef, {
      ...datosProducto,
      empresaId: uid,
    });
  } catch (error) {
    console.error("Error al crear producto:", error);
    throw error;
  }
}

/**
 * Actualiza un producto existente (por su ID).
 * @param {string} productoId
 * @param {Object} datosActualizados — { nombre, descripcion, vencimiento, cantidad, precio, estado }
 * @returns {Promise<void>}
 */
export async function actualizarProducto(productoId, datosActualizados) {
  try {
    const prodRef = doc(db, "productos", productoId);
    await updateDoc(prodRef, {
      ...datosActualizados,
    });
  } catch (error) {
    console.error("Error al actualizar producto:", error);
    throw error;
  }
}

/**
 * Elimina un producto por ID.
 * @param {string} productoId
 * @returns {Promise<void>}
 */
export async function eliminarProducto(productoId) {
  try {
    const prodRef = doc(db, "productos", productoId);
    await deleteDoc(prodRef);
  } catch (error) {
    console.error("Error al eliminar producto:", error);
    throw error;
  }
}

/**
 * Obtiene todos los productos disponibles (para los clientes).
 * @returns {Promise<Array<Object>>}
 */
export async function getProductosDisponibles() {
  try {
    const productosRef = collection(db, "productos");
    const q = query(productosRef, orderBy("vencimiento", "asc"));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error al obtener productos disponibles:", error);
    return [];
  }
}
