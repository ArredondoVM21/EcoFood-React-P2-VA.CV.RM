import { useEffect, useState } from "react";
import { getDocs, collection } from "firebase/firestore";
import { db } from "../../services/firebase";

export default function AdminProductos() {
  const [productos, setProductos] = useState([]);

  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const snapshot = await getDocs(collection(db, "productos"));
        const lista = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setProductos(lista);
      } catch (error) {
        console.error("Error al cargar productos:", error);
      }
    };

    fetchProductos();
  }, []);

  return (
    <div className="container mt-4">
      <h2>Panel de Productos</h2>
      {productos.length === 0 ? (
        <p>No hay productos disponibles.</p>
      ) : (
        <ul className="list-group">
          {productos.map((producto) => (
            <li key={producto.id} className="list-group-item">
              <strong>{producto.nombre}</strong> - {producto.descripcion}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
