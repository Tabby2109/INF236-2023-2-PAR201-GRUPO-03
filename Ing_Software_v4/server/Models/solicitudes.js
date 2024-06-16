const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  rut_paciente: {
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
  inicio_fecha_nuevo: {
    type: Date,
    default: "0",
  },
  final_fecha_nuevo: {
    type: Date,
    default: "0",
  },
  tipoExamen: {
    type: String,
    required: false,
  },
  estadoSolicitud: {
    type: String,
    default: "Pendiente",
  },
  tipoSolicitud: {
    type: String,
    required: false,
  },
});

const Solicitud = mongoose.model('Solicitud', eventSchema);

module.exports = Solicitud;