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
      <label>Titulo:<input type="text" name="nombre_paciente" value={newEvent.nombre_paciente} onChange={handleInputChange} /></label>
      <input type="text"  />
      <label>Inicio:<input type="datetime-local" name="inicio_fecha" value={newEvent.inicio_fecha} onChange={handleInputChange} /></label>
      <label>Fin:<input type="datetime-local" name="final_fecha" value={newEvent.final_fecha} onChange={handleInputChange} /></label>
      <label>Nombre:<input type="text" name="nombre_paciente_desc" value={newEvent.nombre_paciente_desc} onChange={handleInputChange} /></label>
      <label>Teléfono:<input type="text" name="telefono" value={newEvent.telefono} onChange={handleInputChange} /></label>
      <label>RUT:<input type="text" name="rut_paciente" value={newEvent.rut_paciente} onChange={handleInputChange} /></label>
      <label>Tipo de Examen:<input type='text' name="tipoExamen" value={newEvent.tipoExamen} onChange={handleInputChange} /></label>
      <label>RUT del Personal Asociado:<input type="text" name="rut_PA" value={newEvent.rut_PA} onChange={handleInputChange} /></label>
      <div className="button-container">
        <button onClick={handleSave}>Guardar</button>
        <button onClick={handleCancel}>Cancelar</button>
      </div>
    </form>
  );
};

export default NewEventForm;