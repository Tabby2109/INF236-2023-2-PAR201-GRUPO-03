const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const User = require('./Models/user');
const Horas = require('./Models/horas');

// Ruta para el registro de usuario
router.post('/register', async (req, res) => {
    try {
      console.log('Recibiendo solicitud de registro:', req.body);
      const existingUser = await User.findOne({ username: req.body.email });
  
      if (existingUser) {
        return res.status(400).json({ message: 'El usuario ya está registrado.' });
      }
  
      const newUser = new User({
        username: req.body.email,
        password: req.body.password, // Recuerda manejar el hashing de la contraseña
        nombre: req.body.nombre,
        apellido: req.body.apellido,
        tipo: req.body.tipo,
        rut: req.body.rut,
      });
  
      await newUser.save();
  
      console.log('Usuario registrado correctamente.');
      res.status(201).json({ message: 'Usuario registrado correctamente.' });
    } catch (error) {
      console.error('Error durante el registro:', error);
      res.status(500).json({ message: 'Error al registrarse. Inténtalo de nuevo más tarde.' });
    }
  });

// Ruta para el inicio de sesión
router.post('/login', async (req, res) => {
  try {
    const user = await User.findOne({ username: req.body.email });

    if (user && user.password === req.body.password) {
      res.status(200).json({ message: 'Inicio de sesión exitoso.',
      user: {
        nombre: user.nombre,
        apellido: user.apellido,
        tipo: user.tipo,
        rut: user.rut,
        // Otros campos que desees incluir
    }
    });
    } else {
      res.status(401).json({ message: 'Credenciales incorrectas.' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
});


// Ruta para agregar un nuevo evento
router.post('/addEvent', async (req, res) => {
  try {
    const { nombre_paciente, inicio_fecha, final_fecha, description, tipoExamen, rut_PA } = req.body;

    const newEvent = new Horas({
      nombre_paciente,
      inicio_fecha,
      final_fecha,
      description,
      tipoExamen,
      rut_PA,
    });

    await newEvent.save();

    console.log('Usuario registrado correctamente.');
    res.status(201).json({ message: 'Evento agregado correctamente.' });
  } catch (error) {
    console.error('Error al agregar evento:', error);
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
});

// Ruta para obtener todos los eventos
router.get('/getEvents', async (req, res) => {
  try {
    const events = await Horas.find();
    res.status(200).json(events);
  } catch (error) {
    console.error('Error al obtener eventos:', error);
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
});



router.put('/updateEvent/:eventId', async (req, res) => {
  try {
    const eventId = req.params.eventId;
    const { nombre_paciente, inicio_fecha, final_fecha, description, tipoExamen, rut_PA } = req.body;

    const updatedEvent = await Horas.findByIdAndUpdate(
      eventId,
      {
        nombre_paciente,
        inicio_fecha,
        final_fecha,
        description,
        tipoExamen,
        rut_PA,
      },
      { new: true } // Esto devuelve el documento modificado en lugar del original
    );

    if (!updatedEvent) {
      return res.status(404).json({ message: 'Evento no encontrado.' });
    }

    res.status(200).json({ message: 'Evento actualizado correctamente.' });
  } catch (error) {
    console.error('Error al actualizar evento:', error);
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
});

router.delete('/deleteEvent/:eventId', async (req, res) => {
  try {
    const eventId = req.params.eventId;

    // Eliminar el evento por su ID
    const deletedEvent = await Horas.findByIdAndRemove(eventId);

    if (!deletedEvent) {
      return res.status(404).json({ message: 'Evento no encontrado.' });
    }

    res.status(200).json({ message: 'Evento eliminado correctamente.' });
  } catch (error) {
    console.error('Error during operation:', error);
    res.status(500).json({ message: 'Error al eliminar el evento.' });
  }
});


module.exports = router;
