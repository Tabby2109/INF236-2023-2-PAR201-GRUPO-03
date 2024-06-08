// Calendar.jsx
import React, { useState, useEffect, useRef } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import esLocale from '@fullcalendar/core/locales/es';
import './Calendar.css';

function Calendar({ nombre, apellido, rut, tipo ,email }) {
  const [events, setEvents] = useState([]);
  const [reloadSolicitudes, setReloadSolicitudes] = useState(false);
  const [calendarReload, setCalendarReload] = useState(false);
  const [showEventForm, setShowEventForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [showListaSolicitudes, setShowListaSolicitudes] = useState(false);

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
    EstadoExamen: '',
    resultados: '',
  });

  const handleItemClick = (index) => {
    const examItems = document.querySelectorAll('.exam-item');
    examItems.forEach((item, i) => {
      if (i === index) {
        item.classList.toggle('show');
      } else {
        item.classList.remove('show');
      }
    });
  };

  useEffect(() => {
    if (tipo === 'jefe de unidad' && showListaSolicitudes) {
        const fetchSolicitudesPendientes = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/getSolicitudes');
                const data = await response.json();
                if (response.ok) {
                  const filteredEvent = data.filter(event => event.estadoSolicitud === "Pendiente");
                  const formattedEvent = filteredEvent.map(event => ({
                    id: event._id,
                    rut_paciente: event.rut_paciente,
                    fecha_inicio: event.inicio_fecha,
                    fecha_final: event.final_fecha,
                    tipo_examen: event.tipoExamen,
                    estadoSolicitud: event.estadoSolicitud,
                    tipoSolicitud: event.tipoSolicitud,
                    }));
                    setEvents(formattedEvent);
                } else {
                    console.error(data.message);
                }
            } catch (error) {
                console.error('Error al obtener solicitudes pendientes:', error);
            }
        };
        fetchSolicitudesPendientes();
    }
  }, [tipo, reloadSolicitudes, showListaSolicitudes]);

  useEffect(() => {
    const calendarApi = calendarRef.current.getApi();
    
    calendarApi.refetchEvents();
    const fetchEvents = async () => {
      try {

        const response = await fetch('http://localhost:5000/api/getEvents');
        const data = await response.json();

        if (response.ok) {
          const formattedEvents = data.map(event => {
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
      EstadoExamen: clickInfo.event.extendedProps.EstadoExamen,
      resultados: clickInfo.event.extendedProps.resultados
    });

    setShowEventForm(false); // Oculta el formulario de agregar evento
    setShowEditForm(true);
  };

  const handleMostrarLista = () => {
    setShowListaSolicitudes(true);
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
        EstadoExamen: selectedEdit.EstadoExamen,
        resultados: selectedEdit.resultados
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

  const checkAvailability = (newEvent) => {
    const newStart = new Date(newEvent.inicio_fecha);
    const newEnd = new Date(newEvent.final_fecha);

    return !events.some(event => {
      const eventStart = new Date(event.inicio_fecha);
      const eventEnd = new Date(event.final_fecha);
      return event.description.rut_paciente === newEvent.description.rut_paciente &&
        eventStart < newEnd && newStart < eventEnd;
    });
  };

  const handleSaveEvent = async () => {

    if (!checkAvailability(newEvent)) {
      alert("El paciente ya tiene una cita en esta franja horaria.");
      return;
    }
    
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

  const handleRechazarSolicitud = async (examen) => {
    try {
        const response = await fetch(`http://localhost:5000/api/updateSolicitud/${examen.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ estadoSolicitud: 'Rechazado' }),
        });

        if (response.ok) {
            console.log('Solicitud rechazada exitosamente.');
            setReloadSolicitudes(true);
            setCalendarReload(true); // Recargar eventos
            setShowListaSolicitudes(false);
        } else {
            const data = await response.json();
            console.error(data.message);
        }
    } catch (error) {
        console.error('Error al rechazar la solicitud:', error);
    }
  };

  const handleAceptarSolicitud = async (examen) => {
    try {
        // Primero, extraemos el paciente usando su RUT
        const responsePaciente = await fetch(`http://localhost:5000/api/getPaciente/${examen.rut_paciente}`);
        const dataPaciente = await responsePaciente.json();

        if (responsePaciente.ok) {
            const paciente = dataPaciente;

            // Crear un nuevo evento con los datos del examen y el paciente
            const newEvent = {
                nombre_paciente: paciente.nombre,
                inicio_fecha: examen.fecha_inicio,
                final_fecha: examen.fecha_final,
                description: {
                    nombre_paciente_desc: paciente.nombre,
                    telefono: paciente.telefono,
                    rut_paciente: examen.rut_paciente,
                },
                tipoExamen: examen.tipo_examen,
                rut_PA: rut,
                EstadoExamen: 'Pendiente',
                resultados: '',
            };

            // Guardar el evento directamente
            const responseAddEvent = await fetch('http://localhost:5000/api/addEvent', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newEvent),
            });

            if (responseAddEvent.ok) {
                console.log('Evento guardado exitosamente.');

                // Cambia el estado de la solicitud a "Aceptado"
                const responseUpdateSolicitud = await fetch(`http://localhost:5000/api/updateSolicitud/${examen.id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ estadoSolicitud: 'Aceptado' }),
                });

                if (responseUpdateSolicitud.ok) {
                    console.log('Solicitud aceptada exitosamente.');
                    setReloadSolicitudes(true);
                    setCalendarReload(true); // Recargar eventos
                    setShowListaSolicitudes(false);
                } else {
                    const data = await responseUpdateSolicitud.json();
                    console.error(data.message);
                }
            } else {
                const data = await responseAddEvent.json();
                console.error(data.message);
            }
        } else {
            console.error('No se pudo obtener datos del paciente.');
        }
    } catch (error) {
        console.error('Error al aceptar la solicitud:', error);
    }
  };

  const handleCloseLista = () => {
    setReloadSolicitudes(true);
    setCalendarReload(true);
    setShowListaSolicitudes(false);
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
      EstadoExamen: '',
      resultados: '',
    });
  };

  const handleFilterChange = (e) => {
    setTipoExamenFilter(e.target.value);
  };

  const handleDeleteEvent = async (id) => {
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
        <h2>Bienvenido, {nombre} {apellido} {tipo} </h2>
      </div>
      {!showListaSolicitudes && tipo === 'jefe de unidad' && (
        <button onClick={handleMostrarLista}>Mostrar Lista</button>
      )}

      {/* Lista de solicitudes */}
      {showListaSolicitudes && (
        <div>
          <h2>Lista de Solicitudes:</h2>
          <button onClick={handleCloseLista}>Cerrar Lista</button>
          {events.length === 0 ? (
            <p>Lista vacía</p>
          ):(
          <ul className="exam-list">
          {events.map((examen, index) => (
            <li key={index} className="exam-item" onClick={() => handleItemClick(index)}>
              <span>Tipo de Examen: {examen.tipo_examen}</span>
              <div className="exam-detail">
                <p>id: {examen.id}</p>
                <p>Tipo de Solicitud: {examen.tipoSolicitud}</p>
                <p>Fecha Inicio: {examen.fecha_inicio}</p>
                <p>Fecha Final: {examen.fecha_final}</p>
                <p>Rut del paciente: {examen.rut_paciente}</p>
              </div>
              <div className="button-container">
                  <button onClick={() => handleRechazarSolicitud(examen)}>Rechazar</button>
                  <button onClick={() => handleAceptarSolicitud(examen)}>Aceptar</button>
              </div>
            </li>
          ))}
          </ul>
          )}
        </div>
      )}
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
            <p>Estado del Examen: {editFormEvent?.EstadoExamen}</p>
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