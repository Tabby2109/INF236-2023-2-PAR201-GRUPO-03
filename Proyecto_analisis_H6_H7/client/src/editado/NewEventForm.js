// NewEventForm.js
import React, { useState } from 'react';

const NewEventForm = ({ onSave, onCancel }) => {
  const [newEvent, setNewEvent] = useState({
    nombre_paciente: '',
    inicio_fecha: '',
    final_fecha: '',
    nombre_paciente_desc: '',
    telefono: '',
    rut_paciente: '',
    tipoExamen: '',
    rut_PA: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewEvent({
      ...newEvent,
      [name]: value,
    });
  };

  const handleSave = (e) => {
    console.log(newEvent);
    e.preventDefault();
    onSave(newEvent);
  };

  const handleCancel = () => {
    onCancel(); // Puedes ajustar esto según tus necesidades
  };

  return (
    <form className="event-form">
      <label>Titulo:</label>
      <input type="text" name="nombre_paciente" value={newEvent.nombre_paciente} onChange={handleInputChange} />
      <label>Inicio:</label>
      <input type="datetime-local" name="inicio_fecha" value={newEvent.inicio_fecha} onChange={handleInputChange} />
      <label>Fin:</label>
      <input type="datetime-local" name="final_fecha" value={newEvent.final_fecha} onChange={handleInputChange} />
      <label>Nombre:</label>
      <input type="text" name="nombre_paciente_desc" value={newEvent.nombre_paciente_desc} onChange={handleInputChange} />
      <label>Teléfono:</label>
      <input type="text" name="telefono" value={newEvent.telefono} onChange={handleInputChange} />
      <label>RUT:</label>
      <input type="text" name="rut_paciente" value={newEvent.rut_paciente} onChange={handleInputChange} />
      <label>Tipo de Examen:</label>
      <input type='text' name="tipoExamen" value={newEvent.tipoExamen} onChange={handleInputChange} />
      <label>RUT del Personal Asociado:</label>
      <input type="text" name="rut_PA" value={newEvent.rut_PA} onChange={handleInputChange} />
      <div className="button-container">
        <button onClick={handleSave}>Guardar</button>
        <button onClick={handleCancel}>Cancelar</button>
      </div>
    </form>
  );
};

export default NewEventForm;