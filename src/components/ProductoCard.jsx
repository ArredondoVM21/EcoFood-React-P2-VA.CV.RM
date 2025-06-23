import React from "react";
import Swal from "sweetalert2";
import { solicitarProducto } from "./services/pedidoService";

export default function ProductoCard({ producto, clienteId }) {
  const handleClick = async () => {
    const result = await Swal.fire({
      title: "¿Deseas solicitar este producto?",
      text: `Producto: ${producto.nombre}`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Sí, solicitar",
      cancelButtonText: "Cancelar",
    });

    if (result.isConfirmed) {
      try {
        await solicitarProducto({
          clienteId,
          productoId: producto.id,
          empresaId: producto.empresaId,
          cantidad: 1, // o puedes pedir la cantidad al usuario
        });
        Swal.fire("Solicitud enviada", "", "success");
      } catch (error) {
        console.error(error);
        Swal.fire("Error", "No se pudo enviar la solicitud", "error");
      }
    }
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
