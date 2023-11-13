// Sidebar.jsx
import React from 'react';

function Sidebar({ selectedEvent, handleEditEvent }) {
  return (
    <div className="sidebar-container">
      {selectedEvent && (
        <div className="event-details">
          <h3>Detalles del evento</h3>
          <p>Nombre: {selectedEvent.nombre_paciente}</p>
          <p>Inicio: {selectedEvent.inicio_fecha}</p>
          <p>Fin: {selectedEvent.final_fecha}</p>
          {/* ... Otros detalles del evento ... */}
          <button onClick={handleEditEvent}>Editar Evento</button>
        </div>
      )}
    </div>
  );
}

export default Sidebar;