// Calendar.jsx
import React, { useState, useEffect, useRef } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import esLocale from '@fullcalendar/core/locales/es';
import './Calendar.css';

function Calendar({ nombre, apellido, rut, email }) {
  const [events, setEvents] = useState([]);
  const [calendarReload, setCalendarReload] = useState(false);

  const [showEventForm, setShowEventForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);

  const [showEdicion, setShowEdicion] = useState(false);

  const [tipoExamenFilter, setTipoExamenFilter] = useState('');

  const [selectedEvent, setSelectedEvent] = useState(null);
  const [selectedEdit, setselectedEdit] = useState(null);

  const [editFormEvent, setEditFormEvent] = useState(null);

  const [editEventId, setEditEventId] = useState(null);

  const calendarRef = useRef();

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
    rut_PA: rut,
  });

  useEffect(() => {
    const calendarApi = calendarRef.current.getApi();

    calendarApi.refetchEvents();
    const fetchEvents = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/getEvents');
        const data = await response.json();

        if (response.ok) {
          const formattedEvents = data.map(event => {
            console.log('Evento de la base de datos:');
            console.log('ID:', event._id);
            console.log('Nombre del paciente:', event.nombre_paciente);
            console.log('Inicio fecha:', event.inicio_fecha);
            console.log('Final fecha:', event.final_fecha);
            console.log('Descripción:', event.description);
            console.log('Tipo de Examen:', event.tipoExamen);
            console.log('RUT PA:', event.rut_PA);
            const startDate = new Date(event.inicio_fecha);
            const endDate = new Date(event.final_fecha);

            const start = startDate.toISOString();
            const end = endDate.toISOString();

            return {
              ...event,
              start,
              end,
            };
          });

          setEvents(formattedEvents);
          setCalendarReload(false);
        } else {
          console.error(data.message);
        }
      } catch (error) {
        console.error('Error al obtener eventos:', error);
      }
    };

    fetchEvents();
  }, [calendarReload]);

  const handleEventClick = (clickInfo) => {
    const eventDetails = clickInfo.event.extendedProps.description;
    const tipoExamen = clickInfo.event.extendedProps.tipoExamen;

    setEditEventId(clickInfo.event.id || clickInfo.event.extendedProps._id);
    setEditFormEvent({
      id: clickInfo.event.id || clickInfo.event.extendedProps._id,
      nombre_paciente: clickInfo.event.extendedProps.nombre_paciente,
      inicio_fecha: clickInfo.event.start ? clickInfo.event.start.toISOString() : '',
      final_fecha: clickInfo.event.end ? clickInfo.event.end.toISOString() : '',
      description: {
        nombre_paciente_desc: eventDetails.nombre_paciente_desc,
        telefono: eventDetails.telefono,
        rut_paciente: eventDetails.rut_paciente,
      },
      tipoExamen: tipoExamen,
      rut_PA: clickInfo.event.extendedProps.rut_PA,
    });

    setShowEventForm(false); // Oculta el formulario de agregar evento
    setShowEditForm(true);
  };


  const handleEditar = async () => {
    console.log("VOY A ELIMINAR >:C: ", editEventId);
    try {
      const isEditEvent = selectedEdit || selectedEdit.id;
  
      if (!isEditEvent) {
        console.error("No se ha seleccionado un evento válido para editar");
        return;
      }
  
      // Obtener el RUT del personal administrativo en este punto
      const rutPA = rut; // Reemplaza esto con tu lógica real
  
      // Eliminar el evento existente
      await fetch(`http://localhost:5000/api/deleteEvent/${editEventId}`, {
        method: 'DELETE',
      });
  
      // Crear un nuevo evento con los datos editados
      const newEventToSave = {
        nombre_paciente: selectedEdit.nombre_paciente,
        inicio_fecha: selectedEdit.inicio_fecha,
        final_fecha: selectedEdit.final_fecha,
        description: {
          nombre_paciente_desc: selectedEdit.description.nombre_paciente_desc,
          telefono: selectedEdit.description.telefono,
          rut_paciente: selectedEdit.description.rut_paciente,
        },
        tipoExamen: selectedEdit.tipoExamen,
        rut_PA: rutPA,
      };
  
      const response = await fetch('http://localhost:5000/api/addEvent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newEventToSave),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        console.log(data.message);
  
        // Actualizar la lista de eventos en el estado
        const updatedEvents = events.map((event) =>
          event.id === selectedEdit.id ? { ...event, ...newEventToSave } : event
        );
        setEvents(updatedEvents);
  
        // Limpiar y cerrar el formulario de edición
        resetNewEvent();
        setselectedEdit(null);
        setShowEdicion(false);
        setShowEditForm(false);
        setCalendarReload(true);
      } else {
        console.error(data.message);
      }

    } catch (error) {
      console.error('Error durante la operación:', error);
    }
  };


  const handleEditEvent = () => {
    resetNewEvent();
    setShowEdicion(true); // Muestra el formulario de editar evento
    setShowEventForm(false);
  };

  const handleAddEventClick = () => {
    setShowEditForm(false);
    resetNewEvent();
    setShowEdicion(null);
    setSelectedEvent(null);
    setShowEventForm(true);
  };

  const handleModalClose = () => {
    setShowEventForm(false);
    setShowEditForm(false)
    resetNewEvent();
    setSelectedEvent(null);
  };

  const handleEditClose = () => {
    setShowEdicion(false);
    resetNewEvent();
    setselectedEdit(null);
  };

  const handleSaveEvent = async () => {
    try {
      const isNewEvent = !selectedEvent || !selectedEvent.id;
  
      // Obtener el RUT del personal administrativo en este punto
      const rutPA = rut; // Reemplaza esto con tu lógica real
  
      const eventToSave = {
        ...selectedEvent,
        rut_PA: rutPA,
      };
  
      const response = await fetch(
        isNewEvent ? 'http://localhost:5000/api/addEvent' : `http://localhost:5000/api/updateEvent/${selectedEvent.id}`,
        {
          method: isNewEvent ? 'POST' : 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(eventToSave),
        }
      );
  
      const data = await response.json();
  
      if (response.ok) {
        console.log(data.message);
        if (isNewEvent) {
          setEvents([...events, eventToSave]);
        } else {
          const updatedEvents = events.map((event) => (event.id === selectedEvent.id ? eventToSave : event));
          setEvents(updatedEvents);
        }
        resetNewEvent();
        setSelectedEvent(null);
        setShowEventForm(false);

      } else {
        console.error(data.message);
      }
      setCalendarReload(true)
    } catch (error) {
      console.error('Error durante la operación:', error);
    }
  };

  const resetNewEvent = () => {
    setNewEvent({
      nombre_paciente: '',
      inicio_fecha: '',
      final_fecha: '',
      description: {
        nombre_paciente_desc: '',
        telefono: '',
        rut_paciente: '',
      },
      tipoExamen: '',
      rut_PA: rut,
    });
  };

  const handleFilterChange = (e) => {
    setTipoExamenFilter(e.target.value);
  };

  const handleDeleteEvent = async (id) => {
    console.log("VOY A ELIMINAR >:C: ", id);
    try {
      if (editFormEvent || editFormEvent._id) {
        const response = await fetch(`http://localhost:5000/api/deleteEvent/${id}`, {
          method: 'DELETE',
        });

        const data = await response.json();

        if (response.ok) {
          console.log(data.message);
          const updatedEvents = events.filter((event) => event.id !== editFormEvent._id);
          setEvents(updatedEvents);
          resetNewEvent();
          //seteditFormEvent(null);
          setShowEventForm(false);
        } else {
          console.error(data.message);
        }
      }
      setCalendarReload(true);
      setShowEditForm(false);
    } catch (error) {
      console.error('Error during operation:', error);
    }
  };

  const filteredEvents = tipoExamenFilter ? events.filter((event) => event.tipoExamen === tipoExamenFilter) : events;

  return (
    <div className="calendar-container">
      <div>
        <h2>Bienvenido, {nombre} {apellido}</h2>
      </div>
      <div>
        <label>Filtrar por Tipo de Examen:</label>
        <select value={tipoExamenFilter} onChange={handleFilterChange}>
          <option value="">Todos</option>
          <option value="Radiografía">Radiografía</option>
          <option value="Escáner">Escáner</option>
          <option value="Ecografía">Ecografía</option>
          <option value="Resonancia Magnética">Resonancia Magnética</option>
        </select>
      </div>
      <FullCalendar
        ref={calendarRef}
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView={'dayGridMonth'}
        events={filteredEvents}
        calendarReload={calendarReload}
        headerToolbar={{
          start: 'today prev,next',
          center: 'title',
          end: 'dayGridMonth,timeGridWeek,timeGridDay',
        }}
        eventClick={handleEventClick}
        height="600px"
        locales={[esLocale]}
        locale="es"
      />
      <button onClick={handleAddEventClick}>Agregar Evento</button>
      {showEventForm && (
        <div className={`event-modal ${showEventForm ? 'show' : ''}`}>
          <label>Añadir Hora al sistema:</label>
          <form className="event-form">
            <label>Titulo:</label>
            <input type="text" name="nombre_paciente" value={selectedEvent?.nombre_paciente || newEvent.nombre_paciente} onChange={(e) => setSelectedEvent({ ...selectedEvent, nombre_paciente: e.target.value })} />
            <label>Inicio:</label>
            <input type="datetime-local" name="inicio_fecha" value={selectedEvent?.inicio_fecha || newEvent.inicio_fecha} onChange={(e) => setSelectedEvent({ ...selectedEvent, inicio_fecha: e.target.value })} />
            <label>Fin:</label>
            <input type="datetime-local" name="final_fecha" value={selectedEvent?.final_fecha || newEvent.final_fecha} onChange={(e) => setSelectedEvent({ ...selectedEvent, final_fecha: e.target.value })} />
            <label>Nombre:</label>
            <input type="text" name="nombre_paciente_desc" value={selectedEvent?.description?.nombre_paciente_desc || newEvent.description.nombre_paciente_desc} onChange={(e) => setSelectedEvent({ ...selectedEvent, description: { ...selectedEvent.description, nombre_paciente_desc: e.target.value } })} />
            <label>Teléfono:</label>
            <input type="text" name="telefono" value={selectedEvent?.description?.telefono || newEvent.description.telefono} onChange={(e) => setSelectedEvent({ ...selectedEvent, description: { ...selectedEvent.description, telefono: e.target.value } })} />
            <label>RUT:</label>
            <input type="text" name="rut_paciente" value={selectedEvent?.description?.rut_paciente || newEvent.description.rut_paciente} onChange={(e) => setSelectedEvent({ ...selectedEvent, description: { ...selectedEvent.description, rut_paciente: e.target.value } })} />
            <label>Tipo de Examen:</label>
            <select
              name="tipoExamen"
              value={selectedEvent?.tipoExamen || newEvent.tipoExamen}
              onChange={(e) => setSelectedEvent({ ...selectedEvent, tipoExamen: e.target.value })}
            ><option value="">Seleccionar Tipo Examen</option>
              <option value="Radiografía">Radiografía</option>
              <option value="Escáner">Escáner</option>
              <option value="Ecografía">Ecografía</option>
              <option value="Resonancia Magnética">Resonancia Magnética</option>
            </select>
            <label>RUT del Personal Asociado:</label>
            <input type="text" name="rut_PA" value={rut} onChange={(e) => setSelectedEvent({ ...selectedEvent, rut_PA: e.target.value })} disabled/>
            <div className="button-container">
              <button type="button" onClick={handleSaveEvent}>Guardar</button>
              <button type="button" onClick={handleModalClose}>Cancelar</button>
            </div>
          </form>
        </div>
      )}
      {showEdicion && (
        <div className={`event-modal ${showEdicion ? 'show' : ''}`}>
          <label>Formulario de edicion:</label>
          <form className="event-form">
            <label>Titulo:</label>
            <input type="text" name="nombre_paciente" value={selectedEdit?.nombre_paciente || newEvent.nombre_paciente} onChange={(e) => setselectedEdit({ ...selectedEdit, nombre_paciente: e.target.value })} />
            <label>Inicio:</label>
            <input type="datetime-local" name="inicio_fecha" value={selectedEdit?.inicio_fecha || newEvent.inicio_fecha} onChange={(e) => setselectedEdit({ ...selectedEdit, inicio_fecha: e.target.value })} />
            <label>Fin:</label>
            <input type="datetime-local" name="final_fecha" value={selectedEdit?.final_fecha || newEvent.final_fecha} onChange={(e) => setselectedEdit({ ...selectedEdit, final_fecha: e.target.value })} />
            <label>Nombre:</label>
            <input type="text" name="nombre_paciente_desc" value={selectedEdit?.description?.nombre_paciente_desc || newEvent.description.nombre_paciente_desc} onChange={(e) => setselectedEdit({ ...selectedEdit, description: { ...selectedEdit.description, nombre_paciente_desc: e.target.value } })} />
            <label>Teléfono:</label>
            <input type="text" name="telefono" value={selectedEdit?.description?.telefono || newEvent.description.telefono} onChange={(e) => setselectedEdit({ ...selectedEdit, description: { ...selectedEdit.description, telefono: e.target.value } })} />
            <label>RUT:</label>
            <input type="text" name="rut_paciente" value={selectedEdit?.description?.rut_paciente || newEvent.description.rut_paciente} onChange={(e) => setselectedEdit({ ...selectedEdit, description: { ...selectedEdit.description, rut_paciente: e.target.value } })} />
            <label>Tipo de Examen:</label>
            <select
              name="tipoExamen"
              value={selectedEdit?.tipoExamen || newEvent.tipoExamen}
              onChange={(e) => setselectedEdit({ ...selectedEdit, tipoExamen: e.target.value })}
            >
              <option value="Radiografía">Radiografía</option>
              <option value="Escáner">Escáner</option>
              <option value="Ecografía">Ecografía</option>
              <option value="Resonancia Magnética">Resonancia Magnética</option>
            </select>
            <label>RUT del Personal Asociado:</label>
            <input type="text" name="rut_PA" value={rut} onChange={(e) => setselectedEdit({ ...selectedEdit, rut_PA: e.target.value })} disabled/>
            <div className="button-container">
              <button type="button" onClick={() => handleEditar (editEventId)}>Guardar</button>
              <button type="button" onClick={handleEditClose}>Cancelar</button>
            </div>
          </form>
        </div>
      )}
      {showEditForm && (
        <div className={`event-details-container ${showEditForm ? 'show' : ''}`}>
          <div className="event-details">
            <h3>Detalles del evento</h3>
            <p>Nombre: {editFormEvent?.nombre_paciente}</p>
            <p>Inicio: {editFormEvent?.inicio_fecha}</p>
            <p>Fin: {editFormEvent?.final_fecha}</p>
            <p>Descripción:</p>
            <ul>
              <li>Nombre: {editFormEvent?.description?.nombre_paciente_desc}</li>
              <li>Teléfono: {editFormEvent?.description?.telefono}</li>
              <li>RUT: {editFormEvent?.description?.rut_paciente}</li>
            </ul>
            <p>Tipo de Examen: {editFormEvent?.tipoExamen}</p>
            <p>RUT del Personal Asociado: {editFormEvent?.rut_PA}</p>
            <div className='button-container'>
              <button onClick={handleEditEvent}>Editar Evento</button>
              <button onClick={handleModalClose}>Cerrar</button>
              <button onClick={() => handleDeleteEvent (editFormEvent.id)}>Eliminar Evento</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Calendar;