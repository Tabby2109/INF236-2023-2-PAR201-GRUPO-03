//routes/eventRoutes.js
const express = require('express');
const router = express.Router();
const Evento = require('./Models/horas');
const eventController = require('./Controllers/eventController');
const solicitudController = require('./Controllers/solicitudController');

// Ruta para agregar un nuevo evento
router.post('/addEvent', eventController.addEvent);
router.post('/addSolicitud', solicitudController.addSolicitud);

router.post('/addevent', async (req, res) => {
  try {
    const nuevoEvento = new Evento(req.body);
    await nuevoEvento.save();
    res.json({ message: 'Evento agregado correctamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al agregar el evento' });
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
