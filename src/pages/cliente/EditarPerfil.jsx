import React, { useState } from "react";
import { updatePerfilCliente } from "../../services/clienteService";

export default function EditarPerfil() {
  const [form, setForm] = useState({
    nombre: "",
    direccion: "",
    comuna: "",
    password: "",
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await updatePerfilCliente(form);
    alert("Perfil actualizado");
  };

  return (
    <form onSubmit={handleSubmit} className="p-4">
      <input name="nombre" placeholder="Nombre" onChange={handleChange} />
      <br />
      <input name="direccion" placeholder="Dirección" onChange={handleChange} />
      <br />
      <input name="comuna" placeholder="Comuna" onChange={handleChange} />
      <br />
      <input
        name="password"
        placeholder="Contraseña (opcional)"
        type="password"
        onChange={handleChange}
      />
      <br />
      <button type="submit">Guardar</button>
    </form>
  );
}
