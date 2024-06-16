const express = require('express');
const router = express.Router();

// Importa el modelo Paciente desde Database.js
const Paciente = require('../Models/paciente');

// Ruta para obtener todos los pacientes
router.get('/', async (req, res) => {
    try {
        const pacientes = await Paciente.find();
        res.json(pacientes);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error interno del servidor.' });
    }
});

router.get('/getPaciente/:rut', async (req, res) => {
    const rut = req.params.rut;

    try {
        const paciente = await Paciente.findOne({ rut: rut });

        if (!paciente) {
            return res.status(404).json({ message: 'Paciente no encontrado' });
        }

        res.json(paciente);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error interno del servidor.' });
    }
});


// Ruta para crear un nuevo paciente
router.post('/', async (req, res) => {
    try {
        const newPaciente = new Paciente({
            username: req.body.username,
            password: req.body.password,
            nombre: req.body.nombre,
            apellido: req.body.apellido,
            tipo: "paciente", // Por defecto es paciente
            fechaNacimiento: req.body.fechaNacimiento,
            telefono: req.body.telefono,
            alergias: req.body.alergias,
            tramoFonasa: req.body.tramoFonasa,
            rut: req.body.rut,
        });

        await newPaciente.save();

        res.status(201).json({ message: 'Paciente creado correctamente.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error interno del servidor.' });
    }
});

module.exports = router;
