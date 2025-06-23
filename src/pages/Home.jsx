import { useState, useEffect } from "react";
import CardProducto from "../components/CardProducto";
import CerrarSesion from "../components/CerrarSesion";
import { getUserData } from "../services/userService";
import { getProductosDisponibles } from "../services/PedidoService";
import { useAuth } from "../context/AuthContext";

function Home() {
  const { user } = useAuth();
  const [userData, setUserData] = useState(null);
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      if (!user) return;
      try {
        const datos = await getUserData(user.uid);
        setUserData(datos);
        const productosDB = await getProductosDisponibles();
        setProductos(productosDB);
      } catch (error) {
        console.error("Error obteniendo datos:", error);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [user]);

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div>
          <h1>Productos Disponibles</h1>
          {userData && (
            <p className="text-muted">
              Bienvenido {userData.nombre} ({userData.tipo})
            </p>
          )}
        </div>
        <CerrarSesion />
      </div>

      {loading ? (
        <p>Cargando productos...</p>
      ) : (
        <div className="row">
          {productos.map((prod) => (
            <div className="col-md-4 mb-3" key={prod.id}>
              <CardProducto nombre={prod.nombre} precio={`$${prod.precio}`} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Home;
