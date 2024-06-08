// Controllers/solicitudController.js
const Solicitud = require('../Models/solicitudes');

// Controlador para agregar una nueva solicitud
exports.addSolicitud = async (req, res) => {
    try {
        const { rut_paciente, inicio_fecha, final_fecha, inicio_fecha_nuevo, final_fecha_nuevo, tipoExamen, estadoSolicitud, tipoSolicitud } = req.body;

        // Crea una nueva solicitud
        const newSolicitud = new Solicitud({
            rut_paciente,
            inicio_fecha,
            final_fecha,
            inicio_fecha_nuevo,
            final_fecha_nuevo,
            tipoExamen,
            estadoSolicitud,
            tipoSolicitud,
        });

        await newSolicitud.save();

        console.log('Solicitud agregada correctamente.');
        res.status(201).json({ message: 'Solicitud agregada correctamente.' });
    } catch (error) {
        console.error('Error al agregar solicitud:', error);
        res.status(500).json({ message: 'Error interno del servidor.' });
    }
};
