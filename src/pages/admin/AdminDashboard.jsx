import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import { db, secondaryAuth } from '../../services/firebase';
import {
  collection,
  getDocs,
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

// 1) Importamos saveUserData (misma lógica que en Register.jsx)
import { saveUserData } from '../../services/userService';

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
    const q = query(
      collection(db, 'usuarios'),
      where('tipo', '==', 'admin')
    );
    const snapshot = await getDocs(q);
    const data = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setAdmins(data);
  };

  const guardar = async () => {
    try {
      const { nombre, email, password, principal } = form;

      // 1) Validaciones básicas
      if (!nombre || !email || !password) {
        return Swal.fire(
          'Campos incompletos',
          'Por favor, completa todos los campos.',
          'warning'
        );
      }

      // 2) Si quieren crear un admin “principal”, validar que no haya otro
      if (principal) {
        const q = query(
          collection(db, 'usuarios'),
          where('tipo', '==', 'admin'),
          where('principal', '==', true)
        );
        const result = await getDocs(q);
        if (!result.empty) {
          return Swal.fire(
            'Administrador principal existente',
            'Ya existe un administrador principal.',
            'warning'
          );
        }
      }

      try {
        // 3) Crear el usuario en Firebase Auth (usamos secondaryAuth para no cerrar sesión del admin actual)
        const userCredential = await createUserWithEmailAndPassword(
          secondaryAuth,
          email,
          password
        );
        const user = userCredential.user;

        // 4) Enviamos verificación de correo
        await sendEmailVerification(user);

        // 5) GUARDAMOS EN FIRESTORE CON saveUserData → el documento tendrá ID = user.uid
        await saveUserData(user.uid, {
          nombre,
          email,
          principal,
          tipo: 'admin',
        });

        // 6) Mensaje de éxito y limpiamos el form
        Swal.fire(
          'Éxito',
          'Administrador creado correctamente. Se ha enviado un correo de verificación.',
          'success'
        );
        setForm({
          nombre: '',
          email: '',
          password: '',
          principal: false,
        });

        // 7) Refrescamos la lista de admins
        fetchAdmins();
      } catch (authError) {
        // Manejo de errores de Authentication
        if (authError.code === 'auth/email-already-in-use') {
          Swal.fire({
            icon: 'error',
            title: 'Correo ya registrado',
            text: 'Este correo ya está en uso por otro usuario.',
          });
        } else {
          console.error('Error en Firebase Auth:', authError);
          Swal.fire('Error', authError.message, 'error');
        }
      }
    } catch (error) {
      console.error('Error al guardar administrador:', error);
      Swal.fire(
        'Error',
        'Ocurrió un error al guardar el administrador.',
        'error'
      );
    }
  };

  const handleDelete = async (id, principal) => {
    if (principal) {
      return Swal.fire(
        'Acción no permitida',
        'No se puede eliminar el administrador principal.',
        'warning'
      );
    }

    const result = await Swal.fire({
      title: '¿Desea eliminar este administrador?',
      text: 'Esta acción no se podrá deshacer.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    });

    if (result.isConfirmed) {
      await deleteDoc(doc(db, 'usuarios', id));
      fetchAdmins();
      Swal.fire('Eliminado', 'El administrador ha sido eliminado.', 'success');
    }
  };

  const startEditing = (admin) => {
    setEditingId(admin.id);
    setEditForm({
      nombre: admin.nombre,
      email: admin.email,
      principal: admin.principal || false,
    });
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditForm({ nombre: '', email: '', principal: false });
  };

  const saveEdit = async () => {
    if (!editForm.nombre || !editForm.email) {
      return Swal.fire(
        'Campos incompletos',
        'Por favor, completa nombre y email.',
        'warning'
      );
    }

    if (editForm.principal) {
      const q = query(
        collection(db, 'usuarios'),
        where('tipo', '==', 'admin'),
        where('principal', '==', true)
      );
      const result = await getDocs(q);
      const otrosPrincipales = result.docs.filter(
        (doc) => doc.id !== editingId
      );
      if (otrosPrincipales.length > 0) {
        return Swal.fire(
          'Administrador principal existente',
          'Ya existe otro administrador principal.',
          'warning'
        );
      }
    }

    const adminRef = doc(db, 'usuarios', editingId);
    await updateDoc(adminRef, {
      nombre: editForm.nombre,
      email: editForm.email,
      principal: editForm.principal,
    });

    Swal.fire({
      icon: 'success',
      title: 'Administrador actualizado',
      text: 'Los datos se han guardado correctamente.',
    });

    setEditingId(null);
    fetchAdmins();
  };

  return (
    <div className="container mt-4">
      <h2>Gestión de Administradores</h2>

      {/* Formulario para crear administrador */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Nombre"
          value={form.nombre}
          onChange={(e) =>
            setForm({ ...form, nombre: e.target.value })
          }
          maxLength={50}
          className="form-control mb-2"
        />
        <input
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={(e) =>
            setForm({ ...form, email: e.target.value })
          }
          maxLength={60}
          className="form-control mb-2"
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={form.password}
          onChange={(e) =>
            setForm({ ...form, password: e.target.value })
          }
          maxLength={20}
          className="form-control mb-2"
        />
        <div className="form-check mb-2">
          <input
            type="checkbox"
            checked={form.principal}
            onChange={(e) =>
              setForm({ ...form, principal: e.target.checked })
            }
            className="form-check-input"
            id="principalCheckbox"
          />
          <label
            className="form-check-label"
            htmlFor="principalCheckbox"
          >
            Administrador principal
          </label>
        </div>
        <button onClick={guardar} className="btn btn-success">
          Agregar Administrador
        </button>
      </div>

      {/* Tabla de administradores */}
      <table className="table table-striped">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Correo</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {admins.map((admin) => (
            <tr key={admin.id}>
              {editingId === admin.id ? (
                <>
                  <td>
                    <input
                      type="text"
                      value={editForm.nombre}
                      onChange={(e) =>
                        setEditForm({
                          ...editForm,
                          nombre: e.target.value,
                        })
                      }
                      className="form-control"
                      maxLength={50}
                    />
                  </td>
                  <td>
                    <input
                      type="email"
                      value={editForm.email}
                      onChange={(e) =>
                        setEditForm({
                          ...editForm,
                          email: e.target.value,
                        })
                      }
                      className="form-control"
                      maxLength={60}
                    />
                  </td>
                  <td className="d-flex align-items-center">
                    <div className="form-check me-2">
                      <input
                        type="checkbox"
                        checked={editForm.principal}
                        onChange={(e) =>
                          setEditForm({
                            ...editForm,
                            principal: e.target.checked,
                          })
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
                  </td>
                </>
              ) : (
                <>
                  <td>
                    <strong>{admin.nombre}</strong>
                    {admin.principal && (
                      <span className="badge bg-warning text-dark ms-2">
                        Principal
                      </span>
                    )}
                  </td>
                  <td>{admin.email}</td>
                  <td>
                    <button
                      onClick={() => startEditing(admin)}
                      className="btn btn-primary btn-sm me-2"
                      disabled={admin.principal}
                    >
                      Editar
                    </button>
                    <button
                      onClick={() =>
                        handleDelete(admin.id, admin.principal)
                      }
                      className="btn btn-danger btn-sm"
                      disabled={admin.principal}
                    >
                      Eliminar
                    </button>
                  </td>
                </>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
