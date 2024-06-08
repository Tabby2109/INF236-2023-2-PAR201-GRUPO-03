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
                <label>Nombre del Paciente:</label>
                <input type="text" name="nombre_paciente" value={event.nombre_paciente} onChange={handleInputChange} />
                
                <label>Inicio:</label>
                <input type="datetime-local" name="inicio_fecha" value={event.inicio_fecha} onChange={handleInputChange} />
                
                <label>Fin:</label>
                <input type="datetime-local" name="final_fecha" value={event.final_fecha} onChange={handleInputChange} />
                
                <label>Nombre:</label>
                <input type="text" name="nombre_paciente_desc" value={event.description.nombre_paciente_desc} onChange={handleDescriptionChange} />
                
                <label>Teléfono:</label>
                <input type="text" name="telefono" value={event.description.telefono} onChange={handleDescriptionChange} />
                
                <label>RUT:</label>
                <input type="text" name="rut_paciente" value={event.description.rut_paciente} onChange={handleDescriptionChange} />
                
                <label>Tipo de Examen:</label>
                <select name="tipoExamen" value={event.tipoExamen} onChange={handleInputChange}>
                    <option value="">Seleccionar Tipo Examen</option>
                    <option value="Radiografía">Radiografía</option>
                    <option value="Escáner">Escáner</option>
                    <option value="Ecografía">Ecografía</option>
                    <option value="Resonancia Magnética">Resonancia Magnética</option>
                </select>

                <label>RUT del Personal Asociado:</label>
                <input type="text" name="rut_PA" value={rut} disabled />
                
                <label>Estado del Examen:</label>
                <input type="text" name="EstadoExamen" value={event.EstadoExamen} onChange={handleInputChange} />
                
                <label>Resultados:</label>
                <input type="text" name="resultados" value={event.resultados} onChange={handleInputChange} />
                
                <div className="button-container">
                    <button type="submit">Guardar</button>
                    <button type="button" onClick={onCancel}>Cancelar</button>
                </div>
            </form>
        </div>
    );
}

export default EventForm;
