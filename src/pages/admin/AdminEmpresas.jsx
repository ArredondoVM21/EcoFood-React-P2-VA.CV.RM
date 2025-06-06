import { useEffect, useState } from 'react';
import {
  collection,
  setDoc,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
} from 'firebase/firestore';
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
} from 'firebase/auth';
import Swal from 'sweetalert2';

import { db, auth } from '../../services/firebase';

export default function AdminEmpresas() {
  const [empresas, setEmpresas] = useState([]);
  const [form, setForm] = useState({
    nombre: '',
    rut: '',
    direccion: '',
    comuna: '',
    email: '',
    telefono: '',
    password: '',
  });
  const [showModal, setShowModal] = useState(false);
  const [modalForm, setModalForm] = useState({
    nombre: '',
    rut: '',
    direccion: '',
    comuna: '',
    email: '',
    telefono: '',
  });
  const [editandoId, setEditandoId] = useState(null);

  const comunasCuartaRegion = [
    'La Serena',
    'Coquimbo',
    'Andacollo',
    'Vicuña',
    'Paihuano',
    'La Higuera',
    'Ovalle',
    'Monte Patria',
    'Combarbalá',
    'Punitaqui',
    'Río Hurtado',
    'Illapel',
    'Salamanca',
    'Los Vilos',
    'Canela',
  ];

  useEffect(() => {
    obtenerEmpresas();
  }, []);

  const obtenerEmpresas = async () => {
    try {
      const snapshot = await getDocs(collection(db, 'empresas'));
      const lista = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setEmpresas(lista);
    } catch (error) {
      console.error('Error cargando empresas:', error);
      Swal.fire('Error', 'No se pudieron cargar las empresas.', 'error');
    }
  };

  const existeDuplicado = (campo, valor, idExcluir = null) => {
    return empresas.some((empresa) => {
      if (idExcluir && empresa.id === idExcluir) return false;
      return empresa[campo]?.toLowerCase() === valor.toLowerCase();
    });
  };

  // CREAR empresa nueva
  const handleSubmit = async (e) => {
    e.preventDefault();
    const { nombre, rut, direccion, comuna, email, telefono, password } = form;

    if (!nombre || !rut || !direccion || !comuna || !email || !password) {
      return Swal.fire(
        'Campos incompletos',
        'Por favor, completa todos los campos obligatorios.',
        'warning'
      );
    }

    if (existeDuplicado('email', email)) {
      return Swal.fire('Error', 'Este email ya está registrado', 'error');
    }
    if (existeDuplicado('rut', rut)) {
      return Swal.fire('Error', 'Este RUT ya está registrado', 'error');
    }
    if (telefono && existeDuplicado('telefono', telefono)) {
      return Swal.fire('Error', 'Este teléfono ya está registrado', 'error');
    }

    try {
      // 1) Creo el usuario en Firebase Auth
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      const user = cred.user;

      // 2) Envío correo de verificación
      await sendEmailVerification(user);

      // 3) Guardo los datos de la empresa en Firestore, incluyendo "tipo: 'empresa'"
      await setDoc(doc(db, 'empresas', user.uid), {
        nombre,
        rut,
        direccion,
        comuna,
        email,
        telefono,
        productos: [],
        tipo: 'empresa',      // ← Agregamos aquí el campo tipo
      });

      Swal.fire(
        'Agregado',
        'Empresa creada correctamente. Se ha enviado un correo de verificación.',
        'success'
      );

      // 4) Reseteo el formulario y recargo la lista
      setForm({
        nombre: '',
        rut: '',
        direccion: '',
        comuna: '',
        email: '',
        telefono: '',
        password: '',
      });
      await obtenerEmpresas();
    } catch (error) {
      console.error('Error al guardar empresa:', error);
      if (error.code === 'auth/email-already-in-use') {
        return Swal.fire('Error', 'Este correo ya está registrado', 'error');
      }
      Swal.fire('Error', `No se pudo guardar la empresa: ${error.message}`, 'error');
    }
  };

  // EDITAR empresa
  const handleEditarSubmit = async () => {
    const { nombre, rut, direccion, comuna, email, telefono } = modalForm;

    if (!nombre || !rut || !direccion || !comuna || !email) {
      return Swal.fire(
        'Campos incompletos',
        'Por favor, completa todos los campos obligatorios.',
        'warning'
      );
    }

    if (existeDuplicado('email', email, editandoId)) {
      return Swal.fire('Error', 'Este email ya está registrado', 'error');
    }
    if (existeDuplicado('rut', rut, editandoId)) {
      return Swal.fire('Error', 'Este RUT ya está registrado', 'error');
    }
    if (telefono && existeDuplicado('telefono', telefono, editandoId)) {
      return Swal.fire('Error', 'Este teléfono ya está registrado', 'error');
    }

    try {
      const empresaRef = doc(db, 'empresas', editandoId);
      await updateDoc(empresaRef, {
        nombre,
        rut,
        direccion,
        comuna,
        email,
        telefono,
        // Nota: no tocamos el campo "tipo" aquí, ya que permanece "empresa"
      });

      Swal.fire('Guardado', 'Cambios guardados correctamente', 'success');
      setShowModal(false);
      setEditandoId(null);
      setModalForm({
        nombre: '',
        rut: '',
        direccion: '',
        comuna: '',
        email: '',
        telefono: '',
      });
      await obtenerEmpresas();
    } catch (error) {
      console.error('Error al actualizar empresa:', error);
      Swal.fire('Error', `No se pudo actualizar la empresa: ${error.message}`, 'error');
    }
  };

  const handleEliminar = async (id) => {
    const result = await Swal.fire({
      title: '¿Quiere eliminar esta empresa?',
      text: 'Esta acción no se podrá deshacer.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    });

    if (result.isConfirmed) {
      try {
        await deleteDoc(doc(db, 'empresas', id));
        Swal.fire('Eliminado', 'La empresa ha sido eliminada.', 'success');
        await obtenerEmpresas();
      } catch (error) {
        console.error('Error al eliminar empresa:', error);
        Swal.fire('Error', `No se pudo eliminar la empresa: ${error.message}`, 'error');
      }
    }
  };

  const handleEditar = (empresa) => {
    setModalForm({
      nombre: empresa.nombre,
      rut: empresa.rut,
      direccion: empresa.direccion,
      comuna: empresa.comuna,
      email: empresa.email,
      telefono: empresa.telefono,
    });
    setEditandoId(empresa.id);
    setShowModal(true);
  };

  const handleModalChange = (e) => {
    const { name, value } = e.target;
    setModalForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleCancelEdit = () => {
    setShowModal(false);
    setEditandoId(null);
    setModalForm({
      nombre: '',
      rut: '',
      direccion: '',
      comuna: '',
      email: '',
      telefono: '',
    });
  };

  return (
    <div className="container">
      <h2 className="my-4">Gestión de Empresas</h2>

      {/* Formulario de creación */}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Nombre"
          value={form.nombre}
          onChange={(e) => setForm({ ...form, nombre: e.target.value })}
          className="form-control mb-2"
          required
          maxLength={50}
        />
        <input
          type="text"
          placeholder="RUT"
          value={form.rut}
          onChange={(e) => setForm({ ...form, rut: e.target.value })}
          className="form-control mb-2"
          required
          maxLength={12}
        />
        <input
          type="text"
          placeholder="Dirección"
          value={form.direccion}
          onChange={(e) => setForm({ ...form, direccion: e.target.value })}
          className="form-control mb-2"
          required
          maxLength={60}
        />
        <select
          className="form-select mb-2"
          value={form.comuna}
          onChange={(e) => setForm({ ...form, comuna: e.target.value })}
          required
        >
          <option value="">Selecciona una comuna</option>
          {comunasCuartaRegion.map((c, idx) => (
            <option key={idx} value={c}>
              {c}
            </option>
          ))}
        </select>
        <input
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          className="form-control mb-2"
          required
          maxLength={60}
        />
        <input
          type="tel"
          placeholder="Teléfono"
          value={form.telefono}
          onChange={(e) => setForm({ ...form, telefono: e.target.value })}
          className="form-control mb-2"
          maxLength={15}
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          className="form-control mb-3"
          required
          maxLength={20}
        />
        <button className="btn btn-primary">Agregar Empresa</button>
      </form>

      {/* Tabla de empresas */}
      <table className="table mt-4">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>RUT</th>
            <th>Comuna</th>
            <th>Email</th>
            <th>Teléfono</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {empresas.map((emp) => (
            <tr key={emp.id}>
              <td>{emp.nombre}</td>
              <td>{emp.rut}</td>
              <td>{emp.comuna}</td>
              <td>{emp.email}</td>
              <td>{emp.telefono}</td>
              <td>
                <button
                  className="btn btn-sm btn-warning me-2"
                  onClick={() => handleEditar(emp)}
                >
                  Editar
                </button>
                <button
                  className="btn btn-sm btn-danger"
                  onClick={() => handleEliminar(emp.id)}
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal de edición */}
      {showModal && (
        <>
          <div className="modal fade show" style={{ display: 'block' }} tabIndex="-1">
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Editar Empresa</h5>
                  <button type="button" className="btn-close" onClick={handleCancelEdit}></button>
                </div>
                <div className="modal-body">
                  {['nombre', 'rut', 'direccion', 'comuna', 'email', 'telefono'].map((field) => (
                    <div className="mb-2" key={field}>
                      <label className="form-label">
                        {field.charAt(0).toUpperCase() + field.slice(1)}
                      </label>
                      {field === 'comuna' ? (
                        <select
                          name="comuna"
                          className="form-select"
                          value={modalForm.comuna}
                          onChange={handleModalChange}
                          required
                        >
                          <option value="">Selecciona una comuna</option>
                          {comunasCuartaRegion.map((c, idx) => (
                            <option key={idx} value={c}>
                              {c}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <input
                          type={field === 'email' ? 'email' : 'text'}
                          name={field}
                          className="form-control"
                          value={modalForm[field]}
                          onChange={handleModalChange}
                          required={['nombre', 'rut', 'direccion', 'comuna', 'email'].includes(field)}
                        />
                      )}
                    </div>
                  ))}
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={handleCancelEdit}>
                    Cancelar
                  </button>
                  <button type="button" className="btn btn-primary" onClick={handleEditarSubmit}>
                    Guardar cambios
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="modal-backdrop fade show"></div>
        </>
      )}
    </div>
  );
}
