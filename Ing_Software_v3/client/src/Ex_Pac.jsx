import React, { useState, useEffect } from 'react';
import './styles.css';

function Ex_Pac({ userDetails }) {
  const [events, setEvents] = useState([]);
  const [solicitudes, setSolicitudes] = useState([]);
  const [isFormVisible, setFormVisible] = useState(false);
  const [newEvent, setNewEvent] = useState({
    inicio_fecha: '',
    final_fecha: '',
    tipoExamen: '',
  });
  const [isFormValid, setFormValid] = useState(false);

  useEffect(() => {
    const fetchExamenes = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/getEvents`);
        const data = await response.json();
        if (response.ok) {
          const filteredEvents = data.filter(event => event.description.rut_paciente === userDetails.rut);
          const formattedEvents = filteredEvents.map(event => ({
            nombre: event.nombre_paciente,
            fecha_inicio: event.inicio_fecha,
            fecha_final: event.final_fecha,
            descripcion: event.description,
            tipo_examen: event.tipoExamen,
            estado: event.EstadoExamen,
            resultados: event.resultados
          }));
          setEvents(formattedEvents);
        } else {
          console.error(data.message);
        }
      } catch (error) {
        console.error('Error al obtener los exámenes:', error);
      }
    };

    fetchExamenes();
  }, [userDetails.rut]);

  useEffect(() => {
    const fetchSolicitudes = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/getSolicitudes`);
        const data = await response.json();
        if (response.ok) {
          const filteredSolicitudes = data.filter(solicitud => solicitud.rut_paciente === userDetails.rut);
          const formattedEvent = filteredSolicitudes.map(event => ({
            id: event._id,
            rut_paciente: event.rut_paciente,
            fecha_inicio: event.inicio_fecha,
            fecha_final: event.final_fecha,
            tipo_examen: event.tipoExamen,
            estadoSolicitud: event.estadoSolicitud,
            tipoSolicitud: event.tipoSolicitud,
            }));
          setSolicitudes(formattedEvent);
        } else {
          console.error(data.message);
        }
      } catch (error) {
        console.error('Error al obtener las solicitudes:', error);
      }
    };

    fetchSolicitudes();
  }, [userDetails.rut]);

  useEffect(() => {
    const formValid = newEvent.inicio_fecha && newEvent.final_fecha && newEvent.tipoExamen;
    setFormValid(formValid);
  }, [newEvent]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewEvent((prev) => ({ ...prev, [name]: value }));
  };

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

  const handleSolicitudClick = (index) => {
    const solicitudItems = document.querySelectorAll('.solicitud-item');
    solicitudItems.forEach((item, i) => {
      if (i === index) {
        item.classList.toggle('show');
      } else {
        item.classList.remove('show');
      }
    });
  };

  const handleSave = async () => {
    if (!isFormValid) {
      alert('Por favor, completa todos los campos requeridos.');
      return;
    }

    const requestData = {
      ...newEvent,
      rut_paciente: userDetails.rut,
      tipoSolicitud: 'Agendar',
    };

    try {
      const response = await fetch(`http://localhost:5000/api/addSolicitud`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });

      if (response.ok) {
        alert('Solicitud guardada correctamente.');
        setNewEvent({
          inicio_fecha: '',
          final_fecha: '',
          tipoExamen: '',
        });
        setFormVisible(false);
        setFormValid(false);

      } else {
        const data = await response.json();
        alert(`Error: ${data.message}`);
      }
    } catch (error) {
      console.error('Error al guardar la solicitud:', error);
      alert('Error interno del servidor.');
    }
  };

  const handleCancel = () => {
    setNewEvent({
      inicio_fecha: '',
      final_fecha: '',
      tipoExamen: '',
    });
    setFormVisible(false);
    setFormValid(false);
  };

  console.log(solicitudes)
  return (
    <div className="ex-pac-container">
      <h2>Bienvenido, paciente {userDetails.nombre}</h2>
      <div className="content-container">
        <div className="left-column">
          <h2>Lista de Exámenes:</h2>
          <ul className="exam-list">
            {events.map((examen, index) => (
              <li key={index} className="exam-item" onClick={() => handleItemClick(index)}>
                <span>Tipo de Examen: {examen.tipo_examen}</span>
                <div className="exam-detail">
                  <p>Fecha Inicio: {examen.fecha_inicio}</p>
                  <p>Fecha Final: {examen.fecha_final}</p>
                  <p>Estado del Examen: {examen.estado}</p>
                  {examen.estado === "Completado" && (
                    <>
                      <p>Resultados del Examen:</p>
                      {examen.resultados && (
                        <img src={examen.resultados} alt="Resultado del examen" />
                      )}
                    </>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
        <div className="right-column">
          <ul className="solicitud-list">
            {solicitudes.map((solicitud, index) => (
              <li key={index} className="solicitud-item" onClick={() => handleSolicitudClick(index)}>
                <span>Tipo de Examen: {solicitud.tipoExamen}</span>
                <div className="solicitud-detail">
                  <p>Estado de la Solicitud: {solicitud.estadoSolicitud}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="schedule-button-container">
        <button onClick={() => setFormVisible(true)}>Agendar hora</button>
      </div>

      {isFormVisible && (
        <div className="form-container">
          <h3>Agendar hora</h3>
          <form>
            <label>Inicio:</label>
            <input
              type="datetime-local"
              name="inicio_fecha"
              value={newEvent.inicio_fecha}
              onChange={handleInputChange}
            />
            
            <label>Fin:</label>
            <input
              type="datetime-local"
              name="final_fecha"
              value={newEvent.final_fecha}
              onChange={handleInputChange}
            />

            <label>Tipo de Examen:</label>
            <select
              name="tipoExamen"
              value={newEvent.tipoExamen}
              onChange={handleInputChange}
            >
              <option value="">Seleccionar Tipo Examen</option>
              <option value="Radiografía">Radiografía</option>
              <option value="Escáner">Escáner</option>
              <option value="Ecografía">Ecografía</option>
              <option value="Resonancia Magnética">Resonancia Magnética</option>
            </select>

            <div className="form-buttons">
              <button type="button" onClick={handleSave} disabled={!isFormValid}>
                Guardar
              </button>
              <button type="button" onClick={handleCancel}>Cancelar</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

export default Ex_Pac;
