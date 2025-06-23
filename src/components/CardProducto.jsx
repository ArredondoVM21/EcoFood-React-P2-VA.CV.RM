import React from "react";
import dayjs from "dayjs";
import "dayjs/locale/es";
dayjs.locale("es");

export default function CardProducto({ producto, onEditar, onEliminar }) {
  if (!producto) {
    return (
      <div className="card mb-3 shadow-sm">
        <div className="card-body">
          <p className="text-danger">Error: Producto no disponible.</p>
        </div>
      </div>
    );
  }

  const { id, nombre, descripcion, vencimiento, cantidad, precio } = producto;

  const hoy = dayjs();
  const fechaVenc = dayjs(vencimiento);
  const diasRestantes = fechaVenc.diff(hoy, "day");
  const alertaVencePronto = diasRestantes >= 0 && diasRestantes <= 3;

  const formatoPrecio = new Intl.NumberFormat("es-CL", {
    style: "currency",
    currency: "CLP",
    minimumFractionDigits: 0,
  }).format(precio);

  return (
    <div className="card mb-3 shadow-sm">
      <div className="card-body">
        <h5 className="card-title d-flex justify-content-between align-items-center">
          {nombre}
          {precio === 0 && (
            <span className="badge bg-success ms-2">Gratis</span>
          )}
        </h5>
        <p className="card-text">{descripcion}</p>
        <p className="card-text mb-1">
          <strong>Vencimiento:</strong>{" "}
          <span className={alertaVencePronto ? "text-danger" : ""}>
            {fechaVenc.isValid()
              ? fechaVenc.format("DD [de] MMMM, YYYY")
              : "Fecha inválida"}
            {alertaVencePronto && (
              <span className="ms-1 small text-danger">(!) Por vencer</span>
            )}
          </span>
        </p>
        <p className="card-text mb-1">
          <strong>Cantidad:</strong> {cantidad}
        </p>
        <p className="card-text mb-3">
          <strong>Precio:</strong>{" "}
          {precio === 0 ? (
            <span className="text-success">Gratis</span>
          ) : (
            formatoPrecio
          )}
        </p>

        <div className="d-flex justify-content-end">
          <button
            className="btn btn-sm btn-warning me-2"
            onClick={() => onEditar(producto)}
          >
            Editar
          </button>
          <button
            className="btn btn-sm btn-danger"
            onClick={() => onEliminar(id)}
          >
            Eliminar
          </button>
        </div>
      </div>
    </div>
  );
}
