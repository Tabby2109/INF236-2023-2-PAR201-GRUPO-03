// Nuevo componente: EventForm.js
import React, { useState } from 'react';

const EventForm = ({ onSave, onCancel }) => {
  const [newEvent, setNewEvent] = useState({
    nombre_paciente: '',
    inicio_fecha: '',
    final_fecha: '',
    description: {
      nombre_paciente_desc: '',
      telefono: '',
      rut_paciente: '',
    },
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

  const handleDescriptionChange = (e) => {
    const { name, value } = e.target;
    setNewEvent({
      ...newEvent,
      description: {
        ...newEvent.description,
        [name]: value,
      },
    });
  };

  const handleSave = (e) => {
    e.preventDefault();
    onSave(newEvent);
  };

  return (
    <form className="event-form">
    </form>
  );
};

export default EventForm;
