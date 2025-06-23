import { useEffect, useState } from "react";
import {
  collection,
  setDoc,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
} from "firebase/auth";
import Swal from "sweetalert2";

import { db, auth } from "../../services/firebase";

export default function AdminEmpresas() {
  const [empresas, setEmpresas] = useState([]);
  const [form, setForm] = useState({
    nombre: "",
    rut: "",
    direccion: "",
    comuna: "",
    email: "",
    telefono: "",
    password: "",
  });
  const [showModal, setShowModal] = useState(false);
  const [modalForm, setModalForm] = useState({
    nombre: "",
    rut: "",
    direccion: "",
    comuna: "",
    email: "",
    telefono: "",
  });
  const [editandoId, setEditandoId] = useState(null);

  const comunasCuartaRegion = [
    "La Serena",
    "Coquimbo",
    "Andacollo",
    "Vicuña",
    "Paihuano",
    "La Higuera",
    "Ovalle",
    "Monte Patria",
    "Combarbalá",
    "Punitaqui",
    "Río Hurtado",
    "Illapel",
    "Salamanca",
    "Los Vilos",
    "Canela",
  ];

  useEffect(() => {
    obtenerEmpresas();
  }, []);

  const obtenerEmpresas = async () => {
    try {
      const snapshot = await getDocs(collection(db, "empresas"));
      const lista = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setEmpresas(lista);
    } catch (error) {
      console.error("Error cargando empresas:", error);
      Swal.fire("Error", "No se pudieron cargar las empresas.", "error");
    }
  };

  const existeDuplicado = (campo, valor, idExcluir = null) => {
    return empresas.some((empresa) => {
      if (idExcluir && empresa.id === idExcluir) return false;
      return empresa[campo]?.toLowerCase() === valor.toLowerCase();
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const nombre = form.nombre.trim();
    const rut = form.rut.trim();
    const direccion = form.direccion.trim();
    const comuna = form.comuna.trim();
    const email = form.email.trim().toLowerCase();
    const telefono = form.telefono.trim();
    const password = form.password;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return Swal.fire(
        "Correo inválido",
        "Por favor ingresa un correo válido.",
        "warning"
      );
    }

    if (!nombre || !rut || !direccion || !comuna || !email || !password) {
      return Swal.fire(
        "Campos incompletos",
        "Por favor, completa todos los campos obligatorios.",
        "warning"
      );
    }

    if (existeDuplicado("email", email)) {
      return Swal.fire("Error", "Este email ya está registrado", "error");
    }
    if (existeDuplicado("rut", rut)) {
      return Swal.fire("Error", "Este RUT ya está registrado", "error");
    }
    if (telefono && existeDuplicado("telefono", telefono)) {
      return Swal.fire("Error", "Este teléfono ya está registrado", "error");
    }

    try {
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      const user = cred.user;

      await sendEmailVerification(user);

      await setDoc(doc(db, "empresas", user.uid), {
        nombre,
        rut,
        direccion,
        comuna,
        email,
        telefono,
        productos: [],
        tipo: "empresa",
      });

      Swal.fire(
        "Agregado",
        "Empresa creada correctamente. Se ha enviado un correo de verificación.",
        "success"
      );

      setForm({
        nombre: "",
        rut: "",
        direccion: "",
        comuna: "",
        email: "",
        telefono: "",
        password: "",
      });
      await obtenerEmpresas();
    } catch (error) {
      console.error("Error al guardar empresa:", error);
      if (error.code === "auth/email-already-in-use") {
        return Swal.fire("Error", "Este correo ya está registrado", "error");
      }
      Swal.fire(
        "Error",
        `No se pudo guardar la empresa: ${error.message}`,
        "error"
      );
    }
  };

  const handleEditarSubmit = async () => {
    const nombre = modalForm.nombre.trim();
    const rut = modalForm.rut.trim();
    const direccion = modalForm.direccion.trim();
    const comuna = modalForm.comuna.trim();
    const email = modalForm.email.trim().toLowerCase();
    const telefono = modalForm.telefono.trim();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return Swal.fire(
        "Correo inválido",
        "Por favor ingresa un correo válido.",
        "warning"
      );
    }

    if (!nombre || !rut || !direccion || !comuna || !email) {
      return Swal.fire(
        "Campos incompletos",
        "Por favor, completa todos los campos obligatorios.",
        "warning"
      );
    }

    if (existeDuplicado("email", email, editandoId)) {
      return Swal.fire("Error", "Este email ya está registrado", "error");
    }
    if (existeDuplicado("rut", rut, editandoId)) {
      return Swal.fire("Error", "Este RUT ya está registrado", "error");
    }
    if (telefono && existeDuplicado("telefono", telefono, editandoId)) {
      return Swal.fire("Error", "Este teléfono ya está registrado", "error");
    }

    try {
      const empresaRef = doc(db, "empresas", editandoId);
      await updateDoc(empresaRef, {
        nombre,
        rut,
        direccion,
        comuna,
        email,
        telefono,
      });

      Swal.fire("Guardado", "Cambios guardados correctamente", "success");
      setShowModal(false);
      setEditandoId(null);
      setModalForm({
        nombre: "",
        rut: "",
        direccion: "",
        comuna: "",
        email: "",
        telefono: "",
      });
      await obtenerEmpresas();
    } catch (error) {
      console.error("Error al actualizar empresa:", error);
      Swal.fire(
        "Error",
        `No se pudo actualizar la empresa: ${error.message}`,
        "error"
      );
    }
  };

  const handleEliminar = async (id) => {
    const result = await Swal.fire({
      title: "¿Quiere eliminar esta empresa?",
      text: "Esta acción no se podrá deshacer.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });

    if (result.isConfirmed) {
      try {
        await deleteDoc(doc(db, "empresas", id));
        Swal.fire("Eliminado", "La empresa ha sido eliminada.", "success");
        await obtenerEmpresas();
      } catch (error) {
        console.error("Error al eliminar empresa:", error);
        Swal.fire(
          "Error",
          `No se pudo eliminar la empresa: ${error.message}`,
          "error"
        );
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
      nombre: "",
      rut: "",
      direccion: "",
      comuna: "",
      email: "",
      telefono: "",
    });
  };

  return (
    <div className="container">
      <h2 className="my-4">Gestión de Empresas</h2>

      {/* Formulario de creación */}
      {/* ...no se modifica esta parte... */}

      {/* Tabla de empresas */}
      {/* ...sin cambios... */}

      {/* Modal de edición */}
      {/* ...sin cambios... */}
    </div>
  );
}
