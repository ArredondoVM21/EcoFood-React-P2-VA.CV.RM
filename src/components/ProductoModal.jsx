import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import dayjs from "dayjs";

export default function ProductoModal({
  show,
  onClose,
  onGuardar,      // callback para crear o actualizar
  productoEdit,   // si viene, contiene datos para editar
}) {
  // Estado local con todos los campos, incluyendo cantidad
  const [form, setForm] = useState({
    nombre: "",
    descripcion: "",
    vencimiento: "",
    cantidad: 1,    // <-- aquí sí usamos cantidad
    precio: 0,
    estado: "disponible",
  });

  // Si estamos editando, precarga valores
  useEffect(() => {
    if (productoEdit) {
      setForm({
        nombre: productoEdit.nombre,
        descripcion: productoEdit.descripcion,
        vencimiento: productoEdit.vencimiento,
        cantidad: productoEdit.cantidad,  // <-- uso aquí
        precio: productoEdit.precio,
        estado: productoEdit.estado,
      });
    } else {
      // Si es “nuevo”, limpio
      setForm({
        nombre: "",
        descripcion: "",
        vencimiento: "",
        cantidad: 1,
        precio: 0,
        estado: "disponible",
      });
    }
  }, [productoEdit]);

  // Manejar cambios de inputs, incluyendo cantidad
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]:
        name === "cantidad" || name === "precio"
          ? Number(value)
          : value,
    }));
  };

  // Al enviar, validamos y llamamos a onGuardar con todo el form
  const handleSubmit = (e) => {
    e.preventDefault();
    const { nombre, descripcion, vencimiento, cantidad, precio, estado } = form;
    if (!nombre || !descripcion || !vencimiento) {
      return alert("Completa todos los campos obligatorios.");
    }
    // Validar que la fecha no esté en el pasado
    if (dayjs(vencimiento).isBefore(dayjs(), "day")) {
      return alert("La fecha de vencimiento no puede ser anterior a hoy.");
    }
    // Si llegamos aquí, sí usamos 'cantidad' y 'precio'
    onGuardar({ nombre, descripcion, vencimiento, cantidad, precio, estado });
  };

  return (
    <Modal show={show} onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>
          {productoEdit ? "Editar Producto" : "Crear Producto"}
        </Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit}>
        <Modal.Body>
          <Form.Group className="mb-2">
            <Form.Label>Nombre *</Form.Label>
            <Form.Control
              type="text"
              name="nombre"
              value={form.nombre}
              onChange={handleChange}
              maxLength={50}
              required
            />
          </Form.Group>

          <Form.Group className="mb-2">
            <Form.Label>Descripción *</Form.Label>
            <Form.Control
              as="textarea"
              rows={2}
              name="descripcion"
              value={form.descripcion}
              onChange={handleChange}
              maxLength={150}
              required
            />
          </Form.Group>

          <Form.Group className="mb-2">
            <Form.Label>Fecha de Vencimiento *</Form.Label>
            <Form.Control
              type="date"
              name="vencimiento"
              value={form.vencimiento}
              onChange={handleChange}
              required
              min={dayjs().format("YYYY-MM-DD")}
            />
          </Form.Group>

          <Form.Group className="mb-2">
            <Form.Label>Cantidad *</Form.Label>
            <Form.Control
              type="number"
              name="cantidad"
              value={form.cantidad}
              onChange={handleChange}
              min={1}
              required
            />
          </Form.Group>

          <Form.Group className="mb-2">
            <Form.Label>Precio *</Form.Label>
            <Form.Control
              type="number"
              name="precio"
              value={form.precio}
              onChange={handleChange}
              min={0}
              required
            />
          </Form.Group>

          <Form.Group className="mb-2">
            <Form.Label>Estado *</Form.Label>
            <Form.Select
              name="estado"
              value={form.estado}
              onChange={handleChange}
              required
            >
              <option value="disponible">Disponible</option>
              <option value="por vencer">Por vencer</option>
              <option value="agotado">Agotado</option>
            </Form.Select>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={onClose}>
            Cancelar
          </Button>
          <Button variant="primary" type="submit">
            {productoEdit ? "Guardar Cambios" : "Crear Producto"}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}
