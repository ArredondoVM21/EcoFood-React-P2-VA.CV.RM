import React, { useState, useEffect } from "react";
import { updatePerfilCliente } from "../../services/clienteFirebase";
import { getAuth } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../services/firebase";

export default function EditarPerfil() {
  const [form, setForm] = useState({
    nombre: "",
    direccion: "",
    comuna: "",
    password: "",
    email: "",
  });

  useEffect(() => {
    const auth = getAuth();
    const user = auth.currentUser;
    if (user) {
      const ref = doc(db, "clientes", user.uid);
      getDoc(ref).then((snap) => {
        if (snap.exists()) {
          setForm({ ...snap.data(), email: user.email, password: "" });
        }
      });
    }
  }, []);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    const nombre = form.nombre.trim();
    const direccion = form.direccion.trim();
    const comuna = form.comuna.trim();
    const password = form.password;

    if (!nombre || !direccion || !comuna) {
      return alert("Por favor completa todos los campos obligatorios.");
    }

    const dataToUpdate = {
      nombre,
      direccion,
      comuna,
    };

    if (password) {
      dataToUpdate.password = password;
    }

    try {
      await updatePerfilCliente(dataToUpdate);
      alert("Perfil actualizado correctamente");
    } catch (error) {
      console.error("Error al actualizar perfil:", error);
      alert("Ocurrió un error al actualizar el perfil.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4">
      <input name="email" placeholder="Correo" value={form.email} disabled />
      <br />
      <input
        name="nombre"
        placeholder="Nombre"
        onChange={handleChange}
        value={form.nombre}
      />
      <br />
      <input
        name="direccion"
        placeholder="Dirección"
        onChange={handleChange}
        value={form.direccion}
      />
      <br />
      <input
        name="comuna"
        placeholder="Comuna"
        onChange={handleChange}
        value={form.comuna}
      />
      <br />
      <input
        name="password"
        placeholder="Contraseña (opcional)"
        type="password"
        onChange={handleChange}
        value={form.password}
      />
      <br />
      <button type="submit">Guardar</button>
    </form>
  );
}
