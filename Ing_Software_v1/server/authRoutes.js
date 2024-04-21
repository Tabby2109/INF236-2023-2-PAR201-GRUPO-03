const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Paciente = require('./Models/paciente');
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

// Ruta para el registro de paciente
router.post('/register/paciente', async (req, res) => {
  try {
      console.log('Recibiendo solicitud de registro de paciente:', req.body);
      const existingPaciente = await Paciente.findOne({ username: req.body.email });

      if (existingPaciente) {
          return res.status(400).json({ message: 'El paciente ya está registrado.' });
      }

      const newPaciente = new Paciente({
          username: req.body.email,
          password: req.body.password, // Recuerda manejar el hashing de la contraseña
          nombre: req.body.nombre,
          apellido: req.body.apellido,
          tipo: 'paciente', // El tipo es paciente
          fechaNacimiento: req.body.fechaNacimiento,
          telefono: req.body.telefono,
          alergias: req.body.alergias,
          tramoFonasa: req.body.tramoFonasa,
          rut: req.body.rut,
      });

      await newPaciente.save();

      console.log('Paciente registrado correctamente.');
      res.status(201).json({ message: 'Paciente registrado correctamente.' });
  } catch (error) {
      console.error('Error durante el registro de paciente:', error);
      res.status(500).json({ message: 'Error al registrar el paciente. Inténtalo de nuevo más tarde.' });
  }
});

// Ruta para el inicio de sesión
router.post('/login', async (req, res) => {
  try {
    // Busca en la colección de usuarios
    const user = await User.findOne({ rut: req.body.rut });
    
    // Si no se encuentra en la colección de usuarios, busca en la colección de pacientes
    if (!user) {
      const patient = await Paciente.findOne({ rut: req.body.rut });
      if (patient && patient.password === req.body.password) {
        return res.status(200).json({
          message: 'Inicio de sesión exitoso.',
          user: {
            nombre: patient.nombre,
            apellido: patient.apellido,
            tipo: patient.tipo,
            rut: patient.rut,
            // Otros campos que desees incluir
          }
        });
      } else {
        return res.status(401).json({ message: 'Credenciales incorrectas.' });
      }
    }

    // Si se encuentra en la colección de usuarios
    if (user.password === req.body.password) {
      return res.status(200).json({
        message: 'Inicio de sesión exitoso.',
        user: {
          nombre: user.nombre,
          apellido: user.apellido,
          tipo: user.tipo,
          rut: user.rut,
          // Otros campos que desees incluir
        }
      });
    } else {
      return res.status(401).json({ message: 'Credenciales incorrectas.' });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error interno del servidor.' });
  }
});



// Ruta para agregar un nuevo evento
router.post('/addEvent', async (req, res) => {
  try {
    const { nombre_paciente, inicio_fecha, final_fecha, description, tipoExamen, rut_PA , EstadoExamen, resultados} = req.body;

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
    const { nombre_paciente, inicio_fecha, final_fecha, description, tipoExamen, rut_PA , EstadoExamen, resultados} = req.body;

    const updatedEvent = await Horas.findByIdAndUpdate(
      eventId,
      {
        nombre_paciente,
        inicio_fecha,
        final_fecha,
        description,
        tipoExamen,
        rut_PA,
        EstadoExamen,
        resultados,
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
