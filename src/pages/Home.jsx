import { useState, useEffect } from "react";
import CardProducto from '../components/CardProducto';
import CerrarSesion from '../components/CerrarSesion';
import { getUserData } from "../services/userService";
import { useAuth } from "../context/AuthContext";  // asumo que aquí tienes el usuario

function Home() {
  const { user } = useAuth();  // obtener usuario del contexto
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const fetch = async () => {
      if (!user) return;
      try {
        const datos = await getUserData(user.uid);
        setUserData(datos);
      } catch (error) {
        console.error("Error obteniendo datos de usuario:", error);
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

      <CardProducto nombre="Pan Integral" precio="$500" />
    </div>
  );
}

export default Home;
