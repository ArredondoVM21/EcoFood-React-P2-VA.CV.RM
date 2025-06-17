import React from "react";

export default function ProductoCard({ producto }) {
  const handleClick = () => {
    // Confirmar con SweetAlert2 y llamar a solicitarProducto()
  };

  return (
    <div>
      <h3>{producto.nombre}</h3>
      <p>Empresa: {producto.empresa}</p>
      <p>Precio: {producto.precio}</p>
      <button onClick={handleClick}>Solicitar</button>
    </div>
  );
}
