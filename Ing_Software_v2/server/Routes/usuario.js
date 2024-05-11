const express = require('express');
const router = express.Router();

//Importa el modelo User desde Database.js
const User  = require('../Models/user');

//Ruta para obtener todos los usuarios
router.get('/', async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error interno del servidor.' });
    }
});

//Ruta para crear un nuevo usuario
router.post('/', async (req, res) => {
    try {
        const newUser = new User({
            username: req.body.username,
            password: req.body.password,
            nombre: req.body.nombre,
            apellido: req.body.apellido,
            tipo: req.body.tipo,
            rut: req.body.rut,
        });


        await newUser.save();

        res.status(201).json({ message: 'Usuario creado correctamente.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error interno del servidor.' });
    }
});
module.exports = router;