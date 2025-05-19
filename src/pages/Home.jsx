import React, { useEffect, useState } from 'react';
import CerrarSesion from '../components/CerrarSesion';
import { getUserData } from "../services/userService";
import { useAuth } from "../context/AuthContext";

export default function Home() {
  const { user } = useAuth();
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const fetch = async () => {
      const datos = await getUserData(user.uid);
      setUserData(datos);
    };
    if (user) fetch();
  }, [user]);

  return (
    <div>
      <h2>Bienvenido a EcoFood</h2>
      <CerrarSesion />
    </div>
  );
}
