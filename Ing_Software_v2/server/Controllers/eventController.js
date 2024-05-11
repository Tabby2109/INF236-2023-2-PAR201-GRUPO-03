const Horas = require('../Models/horas');

// Controlador para agregar un nuevo horario
exports.addEvent = async (req, res) => {
  try {
    const { nombre_paciente, inicio_fecha, final_fecha, description, tipoExamen, rut_PA , EstadoExamen , resultados} = req.body;

    const newEvent = new Horas({
      nombre_paciente,
      inicio_fecha,
      final_fecha,
      description,
      tipoExamen,
      rut_PA,
      EstadoExamen,
      resultados,
    });

    await newEvent.save();

    console.log('Evento agregado correctamente.');
    res.status(201).json({ message: 'Evento agregado correctamente.' });
  } catch (error) {
    console.error('Error al agregar evento:', error);
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
};
