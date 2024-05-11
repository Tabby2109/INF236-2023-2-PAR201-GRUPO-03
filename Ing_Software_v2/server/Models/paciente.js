const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    nombre: {
        type: String,
        required: true
    },
    apellido: {
        type: String,
        required: true
    },
    tipo: {
        type: String,
        default: "paciente"
    },
    fechaNacimiento: {
      type: Date,
      required: true
    },
    telefono: {
      type: String,
      required: true
    },
    alergias: {
      type: String,
      required: true
    },
    tramoFonasa: {
      type: String,
      enum: ["A", "B", "C", "D"] // Define los valores permitidos para el tramo
    },
    rut: {
      type: String,
      required: true
    }
  });

const Paciente = mongoose.model('Paciente', userSchema);

module.exports = Paciente;