import React, { useEffect, useState } from "react";
import { getMisPedidos } from "../../services/pedidoService";
import PedidoCard from "../../components/PedidoCard";

export default function MisPedidos() {
  const [pedidos, setPedidos] = useState([]);

  useEffect(() => {
    getMisPedidos().then(setPedidos);
  }, []);

  return (
    <div className="p-4">
      <h2>Mis Solicitudes</h2>
      {pedidos.map((p) => (
        <PedidoCard key={p.id} pedido={p} />
      ))}
    </div>
  );
}
