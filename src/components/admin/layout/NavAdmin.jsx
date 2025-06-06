import React from 'react';
import { NavLink } from 'react-router-dom';
import CerrarSesion from '../../CerrarSesion';

export default function NavAdmin() {
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="container">
        <NavLink className="navbar-brand" to="">
          EcoFood
        </NavLink>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#adminNav"
          aria-controls="adminNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon" />
        </button>

        <div className="collapse navbar-collapse" id="adminNav">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <NavLink className="nav-link" to="/admin/productos" end>
                Productos
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/admin/usuarios">
                Usuarios
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/admin/clientes">
                Clientes
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/admin/empresas">
                Empresas
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/admin/dashboard">
                Administradores
              </NavLink>
            </li>
          </ul>
          <CerrarSesion />
        </div>
      </div>
    </nav>
  );
}
