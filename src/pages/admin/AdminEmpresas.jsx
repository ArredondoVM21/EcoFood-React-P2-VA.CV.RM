import { useEffect, useState } from 'react';
import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { db } from '../../services/firebase';

export default function AdminEmpresas() {
  const [empresas, setEmpresas] = useState([]);
  const [form, setForm] = useState({ nombre: '', rut: '', direccion: '', comuna: '', email: '', telefono: '' });
  const [editandoId, setEditandoId] = useState(null);

  useEffect(() => {
    obtenerEmpresas();
  }, []);

  const obtenerEmpresas = async () => {
    const snapshot = await getDocs(collection(db, 'empresas'));
    const lista = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setEmpresas(lista);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editandoId) {
      await updateDoc(doc(db, 'empresas', editandoId), form);
      setEditandoId(null);
    } else {
      await addDoc(collection(db, 'empresas'), { ...form, productos: [] });
    }
    setForm({ nombre: '', rut: '', direccion: '', comuna: '', email: '', telefono: '' });
    obtenerEmpresas();
  };

  const handleEliminar = async (id) => {
    await deleteDoc(doc(db, 'empresas', id));
    obtenerEmpresas();
  };

  const handleEditar = (empresa) => {
    setForm(empresa);
    setEditandoId(empresa.id);
  };

  return (
    <div className="container">
      <h2 className="my-4">Gestión de Empresas</h2>
      <form onSubmit={handleSubmit}>
        {['nombre', 'rut', 'direccion', 'comuna', 'email', 'telefono'].map((campo) => (
          <input
            key={campo}
            type="text"
            placeholder={campo}
            value={form[campo]}
            onChange={(e) => setForm({ ...form, [campo]: e.target.value })}
            className="form-control mb-2"
            required
          />
        ))}
        <button className="btn btn-primary">{editandoId ? 'Actualizar' : 'Agregar'} Empresa</button>
      </form>

      <ul className="mt-4 list-group">
        {empresas.map(emp => (
          <li key={emp.id} className="list-group-item d-flex justify-content-between align-items-center">
            <div>
              <strong>{emp.nombre}</strong> - {emp.email} - {emp.telefono}
            </div>
            <div>
              <button className="btn btn-sm btn-warning me-2" onClick={() => handleEditar(emp)}>Editar</button>
              <button className="btn btn-sm btn-danger" onClick={() => handleEliminar(emp.id)}>Eliminar</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
