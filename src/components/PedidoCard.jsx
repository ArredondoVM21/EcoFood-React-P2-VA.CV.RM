import React from "react";

export default function PedidoCard({ pedido }) {
  return (
    <div>
      <p>Producto: {pedido.productoId}</p>
      <p>Estado: {pedido.estado}</p>
    </div>
  );
}
