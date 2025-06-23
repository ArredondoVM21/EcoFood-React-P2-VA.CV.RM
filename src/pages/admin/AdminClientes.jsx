import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import {
  collection,
  getDocs,
  deleteDoc,
  doc,
  query,
  where,
  updateDoc,
} from "firebase/firestore";
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
} from "firebase/auth";

import { db, auth } from "../../services/firebase";
import { saveUserData } from "../../services/userService";

export default function AdminClientes() {
  const [clientes, setClientes] = useState([]);
  const [clienteActivo, setClienteActivo] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    comuna: "",
    password: "",
  });

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

  const cargarClientes = async () => {
    try {
      const q = query(
        collection(db, "usuarios"),
        where("tipo", "==", "cliente")
      );
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setClientes(data);
    } catch (error) {
      console.error("Error cargando clientes:", error);
      Swal.fire("Error", "No se pudieron cargar los clientes.", "error");
    }
  };

  const guardar = async () => {
    const nombre = formData.nombre.trim();
    const email = formData.email.trim().toLowerCase();
    const comuna = formData.comuna.trim();
    const password = formData.password;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return Swal.fire(
        "Correo inválido",
        "Por favor ingresa un correo válido",
        "warning"
      );
    }

    if (!nombre || !email || !comuna) {
      return Swal.fire(
        "Campos incompletos",
        "Por favor, completa todos los campos (nombre, email, comuna).",
        "warning"
      );
    }

    if (!clienteActivo && !password) {
      return Swal.fire(
        "Falta contraseña",
        "Debes asignar una contraseña para el nuevo cliente.",
        "warning"
      );
    }

    try {
      if (clienteActivo) {
        const clienteRef = doc(db, "usuarios", clienteActivo.id);
        await updateDoc(clienteRef, { nombre, comuna });

        Swal.fire(
          "Actualizado",
          "Cliente actualizado correctamente",
          "success"
        );
      } else {
        const emailExistente = clientes.find((c) => c.email === email);
        if (emailExistente) {
          return Swal.fire("Error", "Este correo ya está registrado", "error");
        }

        const cred = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );
        const user = cred.user;

        await sendEmailVerification(user);

        await saveUserData(user.uid, {
          nombre,
          email,
          comuna,
          tipo: "cliente",
        });

        Swal.fire(
          "Agregado",
          "Cliente registrado correctamente. Se ha enviado un correo de verificación.",
          "success"
        );
      }

      setShowModal(false);
      setClienteActivo(null);
      setFormData({ nombre: "", email: "", comuna: "", password: "" });
      cargarClientes();
    } catch (error) {
      console.error("Error al guardar cliente:", error);
      if (error.code === "auth/email-already-in-use") {
        return Swal.fire("Error", "Este correo ya está registrado", "error");
      }
      Swal.fire("Error", `No se pudo guardar: ${error.message}`, "error");
    }
  };

  const eliminar = async (id) => {
    const result = await Swal.fire({
      title: "¿Eliminar cliente?",
      text: "Esta acción no se puede deshacer",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });

    if (result.isConfirmed) {
      try {
        await deleteDoc(doc(db, "usuarios", id));
        Swal.fire("Eliminado", "Cliente eliminado correctamente", "success");
        cargarClientes();
      } catch (error) {
        console.error("Error al eliminar cliente:", error);
        Swal.fire("Error", "No se pudo eliminar el cliente.", "error");
      }
    }
  };

  useEffect(() => {
    cargarClientes();
  }, []);

  return (
    <div className="container mt-4">
      <h3>Clientes Registrados</h3>
      <button
        className="btn btn-primary mb-3"
        onClick={() => {
          setClienteActivo(null);
          setFormData({
            nombre: "",
            email: "",
            comuna: "",
            password: "",
          });
          setShowModal(true);
        }}
      >
        Agregar Cliente
      </button>

      <table className="table">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Email</th>
            <th>Comuna</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {clientes.map((c) => (
            <tr key={c.id}>
              <td>{c.nombre}</td>
              <td>{c.email}</td>
              <td>{c.comuna}</td>
              <td>
                <button
                  className="btn btn-warning btn-sm me-2"
                  onClick={() => {
                    setClienteActivo(c);
                    setFormData({
                      nombre: c.nombre,
                      email: c.email,
                      comuna: c.comuna,
                      password: "",
                    });
                    setShowModal(true);
                  }}
                >
                  Editar
                </button>
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => eliminar(c.id)}
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showModal && (
        <>
          <div
            className="modal fade show"
            style={{ display: "block" }}
            tabIndex="-1"
            role="dialog"
            aria-labelledby="clienteModalLabel"
            aria-modal="true"
          >
            <div className="modal-dialog" role="document">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title" id="clienteModalLabel">
                    {clienteActivo ? "Editar Cliente" : "Nuevo Cliente"}
                  </h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setShowModal(false)}
                    aria-label="Cerrar"
                  ></button>
                </div>
                <div className="modal-body">
                  <input
                    className="form-control mb-2"
                    placeholder="Nombre"
                    value={formData.nombre}
                    maxLength={45}
                    onChange={(e) =>
                      setFormData({ ...formData, nombre: e.target.value })
                    }
                    required
                  />
                  <input
                    className="form-control mb-2"
                    type="email"
                    placeholder="Email"
                    value={formData.email}
                    maxLength={60}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    disabled={Boolean(clienteActivo)}
                    required
                  />
                  <select
                    className="form-select mb-2"
                    value={formData.comuna}
                    onChange={(e) =>
                      setFormData({ ...formData, comuna: e.target.value })
                    }
                    required
                  >
                    <option value="">Selecciona una comuna</option>
                    {comunasCuartaRegion.map((c, idx) => (
                      <option key={idx} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>

                  {!clienteActivo && (
                    <input
                      className="form-control mb-2"
                      type="password"
                      placeholder="Contraseña"
                      value={formData.password}
                      maxLength={20}
                      onChange={(e) =>
                        setFormData({ ...formData, password: e.target.value })
                      }
                      required
                    />
                  )}
                </div>
                <div className="modal-footer">
                  <button
                    className="btn btn-secondary"
                    onClick={() => setShowModal(false)}
                  >
                    Cancelar
                  </button>
                  <button className="btn btn-success" onClick={guardar}>
                    Guardar
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
