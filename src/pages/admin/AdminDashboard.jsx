// src/pages/admin/AdminDashboard.jsx

import { useEffect, useState } from 'react';
import { db, secondaryAuth } from '../../services/firebase'; 
import {
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
  query,
  where,
  updateDoc,
} from 'firebase/firestore';
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
} from 'firebase/auth';

export default function AdminDashboard() {
  const [admins, setAdmins] = useState([]);
  const [form, setForm] = useState({
    nombre: '',
    email: '',
    password: '',
    principal: false,
  });

  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({
    nombre: '',
    email: '',
    principal: false,
  });

  useEffect(() => {
    fetchAdmins();
  }, []);

  const fetchAdmins = async () => {
    const q = query(collection(db, 'usuarios'), where('tipo', '==', 'admin'));
    const snapshot = await getDocs(q);
    const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    setAdmins(data);
  };

  // Crear administrador
  const handleCreate = async () => {
    try {
      if (!form.nombre || !form.email || !form.password) {
        alert('Por favor, completa todos los campos.');
        return;
      }

      // Verificar si ya existe admin principal
      if (form.principal) {
        const q = query(
          collection(db, 'usuarios'),
          where('tipo', '==', 'admin'),
          where('principal', '==', true)
        );
        const result = await getDocs(q);
        if (!result.empty) {
          alert('Ya existe un administrador principal.');
          return;
        }
      }

      // Crear la cuenta en Firebase Auth (usando secondaryAuth)
      const userCredential = await createUserWithEmailAndPassword(
        secondaryAuth,
        form.email,
        form.password
      );

      const user = userCredential.user;

      // Enviar correo de verificación
      await sendEmailVerification(user);

      // Guardar datos adicionales en Firestore
      await addDoc(collection(db, 'usuarios'), {
        uid: user.uid,
        nombre: form.nombre,
        email: form.email,
        principal: form.principal,
        tipo: 'admin',
      });

      alert('Administrador creado y correo de verificación enviado.');

      setForm({ nombre: '', email: '', password: '', principal: false });
      fetchAdmins();
    } catch (error) {
      console.error('Error al crear administrador:', error);
      alert(error.message);
    }
  };

  // Eliminar administrador
  const handleDelete = async (id, principal) => {
    if (principal) {
      alert('No se puede eliminar el administrador principal.');
      return;
    }

    await deleteDoc(doc(db, 'usuarios', id));
    fetchAdmins();
  };

  // Iniciar edición de un administrador
  const startEditing = (admin) => {
    setEditingId(admin.id);
    setEditForm({
      nombre: admin.nombre,
      email: admin.email,
      principal: admin.principal || false,
    });
  };

  // Cancelar edición
  const cancelEditing = () => {
    setEditingId(null);
    setEditForm({ nombre: '', email: '', principal: false });
  };

  // Guardar cambios tras editar
  const saveEdit = async () => {
    if (!editForm.nombre || !editForm.email) {
      alert('Por favor completa nombre y email.');
      return;
    }

    if (editForm.principal) {
      const q = query(
        collection(db, 'usuarios'),
        where('tipo', '==', 'admin'),
        where('principal', '==', true)
      );
      const result = await getDocs(q);
      const otrosPrincipales = result.docs.filter((doc) => doc.id !== editingId);

      if (otrosPrincipales.length > 0) {
        alert('Ya existe otro administrador principal.');
        return;
      }
    }

    const adminRef = doc(db, 'usuarios', editingId);
    await updateDoc(adminRef, {
      nombre: editForm.nombre,
      email: editForm.email,
      principal: editForm.principal,
    });

    setEditingId(null);
    fetchAdmins();
  };

  return (
    <div className="container mt-4">
      <h2>Gestión de Administradores</h2>

      {/* Formulario para crear administrador */}
      <div className="mb-3">
        <input
          type="text"
          placeholder="Nombre"
          value={form.nombre}
          onChange={(e) => setForm({ ...form, nombre: e.target.value })}
          className="form-control mb-2"
        />
        <input
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          className="form-control mb-2"
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          className="form-control mb-2"
        />
        <div className="form-check">
          <input
            type="checkbox"
            checked={form.principal}
            onChange={(e) => setForm({ ...form, principal: e.target.checked })}
            className="form-check-input"
            id="principalCheckbox"
          />
          <label className="form-check-label" htmlFor="principalCheckbox">
            Administrador principal
          </label>
        </div>
        <button onClick={handleCreate} className="btn btn-primary mt-2">
          Agregar Administrador
        </button>
      </div>

      {/* Lista de administradores (con edición in‐line) */}
      <ul className="list-group">
        {admins.map((admin) => (
          <li
            key={admin.id}
            className="list-group-item d-flex justify-content-between align-items-center"
          >
            {editingId === admin.id ? (
              <div className="d-flex flex-grow-1 align-items-center">
                <input
                  type="text"
                  value={editForm.nombre}
                  onChange={(e) =>
                    setEditForm({ ...editForm, nombre: e.target.value })
                  }
                  className="form-control me-2"
                />
                <input
                  type="email"
                  value={editForm.email}
                  onChange={(e) =>
                    setEditForm({ ...editForm, email: e.target.value })
                  }
                  className="form-control me-2"
                />
                <div className="form-check me-2">
                  <input
                    type="checkbox"
                    checked={editForm.principal}
                    onChange={(e) =>
                      setEditForm({ ...editForm, principal: e.target.checked })
                    }
                    className="form-check-input"
                    id={`editPrincipal-${admin.id}`}
                  />
                  <label
                    className="form-check-label"
                    htmlFor={`editPrincipal-${admin.id}`}
                  >
                    Principal
                  </label>
                </div>
                <button
                  onClick={saveEdit}
                  className="btn btn-success btn-sm me-2"
                >
                  Guardar
                </button>
                <button
                  onClick={cancelEditing}
                  className="btn btn-secondary btn-sm"
                >
                  Cancelar
                </button>
              </div>
            ) : (
              <>
                <div>
                  <strong>{admin.nombre}</strong> – {admin.email}{' '}
                  {admin.principal && (
                    <span className="badge bg-warning text-dark ms-2">
                      Principal
                    </span>
                  )}
                </div>
                <div>
                  <button
                    onClick={() => startEditing(admin)}
                    className="btn btn-primary btn-sm me-2"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleDelete(admin.id, admin.principal)}
                    className="btn btn-danger btn-sm"
                  >
                    Eliminar
                  </button>
                </div>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
