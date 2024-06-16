import React from 'react';

function EventForm({ event, setEvent, onSubmit, onCancel, rut }) {
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEvent((prevEvent) => ({
            ...prevEvent,
            [name]: value,
        }));
    };

    const handleDescriptionChange = (e) => {
        const { name, value } = e.target;
        setEvent((prevEvent) => ({
            ...prevEvent,
            description: {
                ...prevEvent.description,
                [name]: value,
            },
        }));
    };

    return (
        <div className="event-modal show">
            <label>{event ? 'Editar Evento' : 'Agregar Evento'}:</label>
            <form className="event-form" onSubmit={onSubmit}>
                <label>Nombre del Paciente:<input type="text" name="nombre_paciente" value={event.nombre_paciente} onChange={handleInputChange} /></label>
                <label>Inicio:<input type="datetime-local" name="inicio_fecha" value={event.inicio_fecha} onChange={handleInputChange} /></label>
                <label>Fin:<input type="datetime-local" name="final_fecha" value={event.final_fecha} onChange={handleInputChange} /></label>
                <label>Nombre:<input type="text" name="nombre_paciente_desc" value={event.description.nombre_paciente_desc} onChange={handleDescriptionChange} /></label>
                <label>Teléfono:<input type="text" name="telefono" value={event.description.telefono} onChange={handleDescriptionChange} /></label>
                <label>RUT:<input type="text" name="rut_paciente" value={event.description.rut_paciente} onChange={handleDescriptionChange} /></label>               
                <label>Tipo de Examen:</label>
                <select name="tipoExamen" value={event.tipoExamen} onChange={handleInputChange}>
                    <option value="">Seleccionar Tipo Examen</option>
                    <option value="Radiografía">Radiografía</option>
                    <option value="Escáner">Escáner</option>
                    <option value="Ecografía">Ecografía</option>
                    <option value="Resonancia Magnética">Resonancia Magnética</option>
                </select>
                <label>RUT del Personal Asociado:<input type="text" name="rut_PA" value={rut} disabled /></label>
                <label>Estado del Examen:<input type="text" name="EstadoExamen" value={event.EstadoExamen} onChange={handleInputChange} /></label>
                <label>Resultados:<input type="text" name="resultados" value={event.resultados} onChange={handleInputChange} /></label>
                <div className="button-container">
                    <button type="submit">Guardar</button>
                    <button type="button" onClick={onCancel}>Cancelar</button>
                </div>
            </form>
        </div>
    );
}

export default EventForm;
