import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import PerfilEmpresa from './pages/empresa/PerfilEmpresa';

function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        {/* Ruta para el perfil de empresa */}
        <Route path="/empresa/perfil" element={<PerfilEmpresa />} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRouter;
