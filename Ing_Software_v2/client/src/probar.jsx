// Calendar.jsx
import React, { useState, useEffect, useRef } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import esLocale from '@fullcalendar/core/locales/es';
import './Calendar.css';

function Calendar({ nombre, apellido, rut, tipo, email }) {
    const [events, setEvents] = useState([]);
    const [solicitudesPendientes, setSolicitudesPendientes] = useState([]);
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
        EstadoExamen: '',
        resultados: '',
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
                        console.log('Estado Examen:', event.EstadoExamen === "0" ? "Pendiente" : "Completado");

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

    // Nuevo useEffect para obtener solicitudes pendientes si el usuario es jefe de unidad
    useEffect(() => {
        if (tipo === 'jefe de unidad') {
            const fetchSolicitudesPendientes = async () => {
                try {
                    const response = await fetch('http://localhost:5000/api/getSolicitudesPendientes');
                    const data = await response.json();

                    if (response.ok) {
                        setSolicitudesPendientes(data);
                    } else {
                        console.error(data.message);
                    }
                } catch (error) {
                    console.error('Error al obtener solicitudes pendientes:', error);
                }
            };

            fetchSolicitudesPendientes();
        }
    }, [tipo]);

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
            resultados: clickInfo.event.extendedProps.resultados,
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
            const rutPA = rut;

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
                resultados: selectedEdit.resultados,
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
        setShowEditForm(false);
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
            const rutPA = rut;

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
            setCalendarReload(true);
        } catch (error) {
            console.error('Error durante la operación:', error);
        }
    };

    const resetNewEvent = () => {
        setSelectedEvent({
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
        setselectedEdit(null);
    };

    // Renderizado del componente
    return (
        <div className="calendar-container">
            <h2>Bienvenido, {nombre} {apellido} ({tipo})</h2>

            {/* Lista de solicitudes pendientes */}
            {tipo === 'jefe de unidad' && (
                <div className="solicitudes-pendientes-container">
                    <h3>Solicitudes Pendientes</h3>
                    {solicitudesPendientes.length === 0 ? (
                        <p>No hay solicitudes pendientes.</p>
                    ) : (
                        <ul>
                            {solicitudesPendientes.map((solicitud) => (
                                <li key={solicitud.id}>
                                    {solicitud.nombre_paciente} - {solicitud.tipoExamen} - Estado: {solicitud.estadoSolicitud}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            )}

            <div className="calendar-view">
                <button onClick={handleAddEventClick}>Añadir evento</button>

                {/* Calendario */}
                <FullCalendar
                    ref={calendarRef}
                    plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                    initialView={'dayGridMonth'}
                    events={events}
                    headerToolbar={{
                        start: 'today prev,next',
                        center: 'title',
                        end: 'dayGridMonth,timeGridWeek,timeGridDay',
                    }}
                    eventClick={handleEventClick}
                    locales={[esLocale]}
                    locale="es"
                    editable={true}
                />
            </div>

            {/* Formulario para agregar evento */}
            {showEventForm && (
                <div className="modal">
                    <div className="modal-content">
                        <h3>Añadir nuevo evento</h3>
                        <form>
                            <label htmlFor="nombre_paciente">Nombre del paciente:</label>
                            <input
                                type="text"
                                id="nombre_paciente"
                                name="nombre_paciente"
                                value={selectedEvent.nombre_paciente}
                                onChange={(e) => setSelectedEvent({ ...selectedEvent, nombre_paciente: e.target.value })}
                            />

                            <label htmlFor="inicio_fecha">Inicio de fecha:</label>
                            <input
                                type="datetime-local"
                                id="inicio_fecha"
                                name="inicio_fecha"
                                value={selectedEvent.inicio_fecha}
                                onChange={(e) => setSelectedEvent({ ...selectedEvent, inicio_fecha: e.target.value })}
                            />

                            <label htmlFor="final_fecha">Final de fecha:</label>
                            <input
                                type="datetime-local"
                                id="final_fecha"
                                name="final_fecha"
                                value={selectedEvent.final_fecha}
                                onChange={(e) => setSelectedEvent({ ...selectedEvent, final_fecha: e.target.value })}
                            />

                            <label htmlFor="description">Descripción:</label>
                            <textarea
                                id="description"
                                name="description"
                                value={selectedEvent.description}
                                onChange={(e) => setSelectedEvent({ ...selectedEvent, description: e.target.value })}
                            ></textarea>

                            <label htmlFor="tipoExamen">Tipo de Examen:</label>
                            <input
                                type="text"
                                id="tipoExamen"
                                name="tipoExamen"
                                value={selectedEvent.tipoExamen}
                                onChange={(e) => setSelectedEvent({ ...selectedEvent, tipoExamen: e.target.value })}
                            />

                            <button type="button" onClick={handleSaveEvent}>
                                Guardar evento
                            </button>
                            <button type="button" onClick={handleModalClose}>
                                Cerrar
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* Formulario para editar evento */}
            {showEditForm && (
                <div className="modal">
                    <div className="modal-content">
                        <h3>Editar evento</h3>
                        <form>
                            <label htmlFor="nombre_paciente">Nombre del paciente:</label>
                            <input
                                type="text"
                                id="nombre_paciente"
                                name="nombre_paciente"
                                value={editFormEvent.nombre_paciente}
                                onChange={(e) =>
                                    setEditFormEvent({ ...editFormEvent, nombre_paciente: e.target.value })
                                }
                            />

                            <label htmlFor="inicio_fecha">Inicio de fecha:</label>
                            <input
                                type="datetime-local"
                                id="inicio_fecha"
                                name="inicio_fecha"
                                value={editFormEvent.inicio_fecha}
                                onChange={(e) =>
                                    setEditFormEvent({ ...editFormEvent, inicio_fecha: e.target.value })
                                }
                            />

                            <label htmlFor="final_fecha">Final de fecha:</label>
                            <input
                                type="datetime-local"
                                id="final_fecha"
                                name="final_fecha"
                                value={editFormEvent.final_fecha}
                                onChange={(e) =>
                                    setEditFormEvent({ ...editFormEvent, final_fecha: e.target.value })
                                }
                            />

                            <label htmlFor="description">Descripción:</label>
                            <textarea
                                id="description"
                                name="description"
                                value={editFormEvent.description}
                                onChange={(e) =>
                                    setEditFormEvent({ ...editFormEvent, description: e.target.value })
                                }
                            ></textarea>

                            <label htmlFor="tipoExamen">Tipo de Examen:</label>
                            <input
                                type="text"
                                id="tipoExamen"
                                name="tipoExamen"
                                value={editFormEvent.tipoExamen}
                                onChange={(e) =>
                                    setEditFormEvent({ ...editFormEvent, tipoExamen: e.target.value })
                                }
                            />

                            <button type="button" onClick={handleEditar}>
                                Guardar cambios
                            </button>
                            <button type="button" onClick={handleEditClose}>
                                Cerrar
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Calendar;
