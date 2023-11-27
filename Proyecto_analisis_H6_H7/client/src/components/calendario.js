import React from 'react';
import { Calendar as BigCalendar } from 'react-big-calendar';
import testData from './data'; // Importa los datos de prueba

const MyCalendar = () => {
  return (
    <div>
      <BigCalendar
        events={testData}
        startAccessor="start"
        endAccessor="end"
        onSelectEvent={(event) => console.log(event)}
      />
    </div>
  );
};

export default MyCalendar;
