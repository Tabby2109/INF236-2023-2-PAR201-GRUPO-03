//Routes/solicitudRoutes.js
const express = require('express');
const router = express.Router();
const Solicitud = require('../Models/solicitudes');

router.post('/addSolicitud', async (req, res) => {
    try {
        console.log('Datos recibidos para el nuevo evento:', req.body);
        const newEvent = new Solicitud(req.body);
        await newEvent.save();
        res.status(201).json({ message: 'Evento agregado correctamente.' });
    } catch (error) {
        console.error('Error al agregar el evento:', error);
        res.status(500).json({ message: 'Error interno del servidor al agregar el evento.' });
    }
});

router.put('/updateSolicitud/:id', async (req, res) => {
    const solicitudId = req.params.id;

    // Verifica si solicitudId es un ObjectId válido
    if (!mongoose.Types.ObjectId.isValid(solicitudId)) {
        return res.status(400).json({ message: 'ID de solicitud no válido' });
    }

    const { estadoSolicitud } = req.body;

    try {
        const solicitud = await Solicitud.findById(solicitudId);

        if (!solicitud) {
            return res.status(404).json({ message: 'Solicitud no encontrada' });
        }

        solicitud.estadoSolicitud = estadoSolicitud;
        await solicitud.save();

        res.json({ message: 'Estado de la solicitud actualizado correctamente' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error interno del servidor.' });
    }
});



router.get('/getSolicitudes', async (req, res) => {
    try {
        // Consultar la base de datos para obtener las solicitudes pendientes
        const solicitudesPendientes = await Solicitud.find({ estadoSolicitud: "Pendiente" });
  
        // Enviar la lista de solicitudes pendientes como respuesta JSON
        res.status(200).json(solicitudesPendientes);
    } catch (error) {
        console.error('Error al obtener solicitudes pendientes:', error);
        res.status(500).json({ message: 'Error al obtener solicitudes pendientes.' });
    }
});

module.exports = router;
