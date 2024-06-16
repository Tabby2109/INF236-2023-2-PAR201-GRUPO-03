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
      enum: ["medico", "jefe de unidad"], // Define los valores permitidos
      required: true
  },
  rut: {
    type: String,
    required: true
  }
});

const User = mongoose.model('User', userSchema);

module.exports = User;