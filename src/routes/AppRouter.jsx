import { Routes, Route, Navigate } from "react-router-dom";
import Login from "../pages/Login";
import Register from "../pages/Register";
import RecuperarContrasena from "../components/RecuperarContrasena";
import Home from "../pages/Home";
import ProtectedRoute from "./ProtectedRoute";
import ProtectedByRole from "./ProtectedByRole";

// Cliente
import ClienteDashboard from "../pages/cliente/ClienteDashboard";

// Admin
import AdminLayout from "../components/admin/layout/AdminLayout";
import AdminDashboard from "../pages/admin/AdminDashboard";
import AdminProductos from "../pages/admin/AdminProductos";
import AdminUsuarios from "../pages/admin/AdminUsuarios";
import AdminClientes from "../pages/admin/AdminClientes";
import AdminEmpresas from "../pages/admin/AdminEmpresas";

// Empresa (importa estos dos)
import PerfilEmpresa from "../pages/empresa/PerfilEmpresa";
import ProductosEmpresa from "../pages/empresa/ProductosEmpresa";

export default function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/registro" element={<Register />} />
      <Route path="/recuperar" element={<RecuperarContrasena />} />

      <Route
        path="/home"
        element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        }
      />

      <Route
        path="/cliente/dashboard"
        element={
          <ProtectedByRole allowed={["cliente"]}>
            <ClienteDashboard />
          </ProtectedByRole>
        }
      />

      {/* Rutas protegidas para administradores */}
      <Route
        path="/admin"
        element={
          <ProtectedByRole allowed={["admin"]}>
            <AdminLayout />
          </ProtectedByRole>
        }
      >
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="productos" element={<AdminProductos />} />
        <Route path="usuarios" element={<AdminUsuarios />} />
        <Route path="clientes" element={<AdminClientes />} />
        <Route path="empresas" element={<AdminEmpresas />} />
        <Route index element={<Navigate to="dashboard" replace />} />
      </Route>


      <Route
        path="/empresa"
        element={
          <ProtectedByRole allowed={["empresa"]}>
            <></>
          </ProtectedByRole>
        }
      >
        <Route path="perfil" element={<PerfilEmpresa />} />
        <Route path="productos" element={<ProductosEmpresa />} />
        <Route index element={<Navigate to="perfil" replace />} />
      </Route>

      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}
