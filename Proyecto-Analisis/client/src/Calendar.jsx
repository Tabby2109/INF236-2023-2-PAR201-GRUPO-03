import React, { useState, useEffect, useRef } from 'react';
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import esLocale from '@fullcalendar/core/locales/es';
import './Calendar.css';

function Calendar() {
  const [events, setEvents] = useState([]);
  const [showEventModal, setShowEventModal] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: '',
    start: '',
    end: '',
    description: {
      name: '',
      phone: '',
      rut: '',
    },
    tipoExamen: '',
  });
  const [tipoExamenFilter, setTipoExamenFilter] = useState('');
  const calendarRef = useRef();

  useEffect(() => {
    setEvents([
      { id: '1', title: 'Hora Juan', start: '2023-10-31T14:30:00', end: '2023-10-31T16:00:00', description: { name: 'Juan Carvajales', phone: '+569 11223344', rut: '19352851-k' }, tipoExamen: 'Radiografía' },
      { id: '3', title: 'Hora Pedro', start: '2023-10-30T16:00:00', end: '2023-10-30T17:00:00', description: { name: 'Pedro Tamales', phone: '+569 99887766', rut: '19034567-9' }, tipoExamen: 'Escáner' },
      { id: '2', title: 'Hora Maria', start: '2023-11-01T16:40:00', end: '2023-11-01T17:50:00', description: { name: 'Maria Rios', phone: '+569 11992288', rut: '202073500-k' }, tipoExamen: 'Ecografía' },
    ]);
  }, []);

  const handleEventClick = (clickInfo) => {
    const eventDetails = clickInfo.event.extendedProps.description;
    const tipoExamen = clickInfo.event.extendedProps.tipoExamen;
    alert(`Detalles del evento:\nNombre: ${eventDetails.name}\nTeléfono: ${eventDetails.phone}\nRUT: ${eventDetails.rut}\nTipo de Examen: ${tipoExamen}`);
  };

  const handleAddEventClick = () => {
    setShowEventModal(true);
  };

  const handleModalClose = () => {
    setShowEventModal(false);
    setNewEvent({
      title: '',
      start: '',
      end: '',
      description: {
        name: '',
        phone: '',
        rut: '',
      },
      tipoExamen: '',
    });
  };

  const handleSaveEvent = () => {
    setEvents([...events, newEvent]);
    setShowEventModal(false);
    setNewEvent({
      title: '',
      start: '',
      end: '',
      description: {
        name: '',
        phone: '',
        rut: '',
      },
      tipoExamen: '',
    });
  };

  const handleFilterChange = (e) => {
    setTipoExamenFilter(e.target.value);
  };

  const filteredEvents = tipoExamenFilter
    ? events.filter((event) => event.tipoExamen === tipoExamenFilter)
    : events;

  return (
    <div className="calendar-container">
    <div>
      <label>Filtrar por Tipo de Examen:</label>
      <select value={tipoExamenFilter} onChange={handleFilterChange}>
        <option value="">Todos</option>
        <option value="Radiografía">Radiografía</option>
        <option value="Escáner">Escáner</option>
        <option value="Ecografía">Ecografía</option>
        <option value="Resonancia Magnética">Resonancia Magnética</option>
        {/* Agrega más opciones según tus tipos de examen */}
      </select>
    </div>
    <FullCalendar
      ref={calendarRef}
      plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
      initialView={"dayGridMonth"}
      events={filteredEvents}
      headerToolbar={{
        start: "today prev,next",
        center: "title",
        end: "dayGridMonth,timeGridWeek,timeGridDay",
      }}
      eventClick={handleEventClick}
      height="600px"
      locales={[esLocale]}
      locale="es"
    />
      <button onClick={handleAddEventClick}>Agregar Evento</button>

      {showEventModal && (
  <div className="event-modal">
    <form className="event-form">
      <label>Titulo:</label>
      <input type="text" value={newEvent.title} onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })} />
      <label>Inicio:</label>
      <input type="datetime-local" value={newEvent.start} onChange={(e) => setNewEvent({ ...newEvent, start: e.target.value })} />
      <label>Fin:</label>
      <input type="datetime-local" value={newEvent.end} onChange={(e) => setNewEvent({ ...newEvent, end: e.target.value })} />
      <label>Nombre:</label>
      <input type="text" value={newEvent.description.name} onChange={(e) => setNewEvent({ ...newEvent, description: { ...newEvent.description, name: e.target.value } })} />
      <label>Teléfono:</label>
      <input type="text" value={newEvent.description.phone} onChange={(e) => setNewEvent({ ...newEvent, description: { ...newEvent.description, phone: e.target.value } })} />
      <label>RUT:</label>
      <input type="text" value={newEvent.description.rut} onChange={(e) => setNewEvent({ ...newEvent, description: { ...newEvent.description, rut: e.target.value } })} />
      <label>Tipo de Examen:</label>
      <select
        value={newEvent.tipoExamen}
        onChange={(e) =>
          setNewEvent({ ...newEvent, tipoExamen: e.target.value })
        }
      >
        <option value="Radiografía">Radiografía</option>
        <option value="Escáner">Escáner</option>
        <option value="Ecografía">Ecografía</option>
        <option value="Resonancia Magnética">Resonancia Magnética</option>
      </select>
      <div className="button-container">
        <button onClick={handleSaveEvent}>Guardar</button>
        <button onClick={handleModalClose}>Cancelar</button>
      </div>
    </form>
  </div>
)}
</div>
);}

export default Calendar;