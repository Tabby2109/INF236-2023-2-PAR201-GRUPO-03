const {Schema, model} = require('mongoose')

const usuarioSchema = new Schema({
    nombre: String,
    apellido: String,
    edad: Number,
    telefoino: Number,
    correo: String
},
{
    timestamps: true
})

module.exports = model('Usuario', usuarioSchema)