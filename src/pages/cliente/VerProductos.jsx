import React, { useEffect, useState } from "react";
import {
  getProductosDisponibles,
  solicitarProducto,
} from "../../services/pedidoService";
import ProductoCard from "../../components/ProductoCard";

export default function VerProductos() {
  const [productos, setProductos] = useState([]);

  useEffect(() => {
    getProductosDisponibles().then(setProductos);
  }, []);

  return (
    <div className="p-4">
      <h2>Productos Disponibles</h2>
      {productos.map((prod) => (
        <ProductoCard key={prod.id} producto={prod} />
      ))}
    </div>
  );
}
