import { useEffect, useState } from "react";
import { getDocs, collection } from "firebase/firestore";
import { db } from "../../services/firebase";

export default function AdminUsuarios() {
  const [usuarios, setUsuarios] = useState([]);

  useEffect(() => {
    const fetchUsuarios = async () => {
      try {
        const snapshot = await getDocs(collection(db, "usuarios"));
        const lista = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setUsuarios(lista);
      } catch (error) {
        console.error("Error al cargar usuarios:", error);
      }
    };

    fetchUsuarios();
  }, []);

  return (
    <div className="container mt-4">
      <h2>Panel de Usuarios</h2>
      {usuarios.length === 0 ? (
        <p>No hay usuarios registrados.</p>
      ) : (
        <ul className="list-group">
          {usuarios.map((usuario) => (
            <li key={usuario.id} className="list-group-item">
              <strong>{usuario.nombre}</strong> - {usuario.email}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
