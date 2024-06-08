const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

const db = require("./Database");
const authRoutes = require('./authRoutes');
const eventRoutes = require('./eventRoutes');


const app = express();

app.set("port", process.env.PORT || 5000);

//Middlewares
app.use(morgan("dev"));
app.use(express.json());
app.use(cors());

//rutas
app.get('/', (req, res) => {
    res.send('Bienvenido a mi api rest full');
})

//Rutas de autenticacion
app.use('/api', authRoutes);
app.use('/api', eventRoutes);

//Rutas de usuarios
app.use('/api/usuarios', require('./Routes/usuario'));

app.use('/api/usuarios', require('./Routes/usuario_paciente'));

// Rutas de eventos
app.use('/api/events', require('./Routes/solicitudRoutes'));
app.use('/api/events', require('./Routes/events'));

app.use(express.json());

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Error interno del servidor.' });
});


db().then(() => {
    app.listen(app.get("port"), () => {
        console.log(`Servidor está corriendo en el puerto: ${app.get("port")}`);
    });
}).catch((error) => {
    console.error("Error al conectar a la base de datos:", error);
});


module.exports = app;