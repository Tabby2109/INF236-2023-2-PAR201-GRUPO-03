import React, { useState, useEffect } from 'react';
import './styles.css';

function Ex_Pac({ userDetails }) {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const fetchExamenes = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/getEvents`);
        const data = await response.json();
        if (response.ok) {
          const filteredEvents = data.filter((event) => event.description.rut_paciente === userDetails.rut);
          const formattedEvents = filteredEvents.map(event => {
            return {
              nombre: event.nombre_paciente,
              fecha_inicio: event.inicio_fecha,
              fecha_final: event.final_fecha,
              descripcion: event.description,
              tipo_examen: event.tipoExamen,
              estado: event.EstadoExamen === "1" ? "Pendiente" : "Completado",
              resultados: event.resultados
            };
          });
          setEvents(formattedEvents); // Establecer el estado con los exámenes formateados
        } else {
          console.error(data.message);
        }
      } catch (error) {
        console.error('Error al obtener los exámenes:', error);
      }
    };

    fetchExamenes();
  }, [userDetails.rut]);
  
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

  return (
    <div>
      <h2>Bienvenido, paciente {userDetails.nombre}</h2>
      <h2>Lista de Exámenes:</h2>
      <ul className="exam-list">
        {events.map((examen, index) => (
          <li key={index} className="exam-item" onClick={() => handleItemClick(index)}>
            <span>Tipo de Examen: {examen.tipo_examen}</span>
            <div className="exam-detail">
              <span>Fecha Inicio: {examen.fecha_inicio}</span>
              <span>Fecha Final: {examen.fecha_final}</span>
              <span>Estado del Examen: {examen.estado}</span>
              {/* Mostrar la imagen */}
              <span className="exam-img">Resultados del Examen: </span>
              {examen.resultados && (
                <img src={examen.resultados} alt="Resultado del examen" />
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Ex_Pac;