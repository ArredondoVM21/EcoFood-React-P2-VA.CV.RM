import React from "react";

export default function PedidoCard({ pedido, onCancelar }) {
  return (
    <div
      style={{ border: "1px solid #ccc", padding: "1rem", borderRadius: "8px" }}
    >
      <p>
        <strong>Producto:</strong> {pedido.productoNombre} (ID:{" "}
        {pedido.productoId})
      </p>
      <p>
        <strong>Empresa:</strong> {pedido.empresaNombre}
      </p>
      <p>
        <strong>Cantidad:</strong> {pedido.cantidadSolicitada}
      </p>
      <p>
        <strong>Estado:</strong> {pedido.estado}
      </p>
      <p>
        <strong>Fecha:</strong>{" "}
        {pedido.fecha.toDate
          ? pedido.fecha.toDate().toLocaleDateString()
          : pedido.fecha}
      </p>
      {onCancelar && <button onClick={onCancelar}>Cancelar solicitud</button>}
    </div>
  );
}
