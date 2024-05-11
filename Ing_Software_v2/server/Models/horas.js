const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  nombre_paciente: {
    type: String,
    required: false,
  },
  inicio_fecha: {
    type: Date,
    required: false,
  },
  final_fecha: {
    type: Date,
    required: false,
  },
  description: {
    nombre_paciente_desc: {
      type: String,
      required: false,
    },
    telefono: {
      type: String,
      required: false,
    },
    rut_paciente: {
      type: String,
      required: false,
    },
  },
  tipoExamen: {
    type: String,
    required: false,
  },
  rut_PA: {
    type: String,
    required: false,
  },
  EstadoExamen: {
    type: String,
    default: "Pendiente",
  },
  resultados: {
    type: String,
    required: false,
  },
});

const Horas = mongoose.model('horas', eventSchema);

module.exports = Horas;
