import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import Login from "../pages/Login";
import PerfilEmpresa from "../pages/empresa/PerfilEmpresa";
import ClienteDashboard from "../pages/cliente/ClienteDashboard";
import VerProductos from "../pages/cliente/VerProductos";
import MisPedidos from "../pages/cliente/MisPedidos";
import EditarPerfil from "../pages/cliente/EditarPerfil";

function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/empresa/perfil" element={<PerfilEmpresa />} />
        <Route path="/cliente" element={<ClienteDashboard />} />
        <Route path="/cliente/dashboard" element={<ClienteDashboard />} />{" "}
        {/* <-- agrega esta línea */}
        <Route path="/cliente/productos" element={<VerProductos />} />
        <Route path="/cliente/pedidos" element={<MisPedidos />} />
        <Route path="/cliente/editar" element={<EditarPerfil />} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRouter;
