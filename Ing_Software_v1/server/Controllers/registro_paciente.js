// Importa el modelo de paciente
const Paciente = require('./Models/paciente'); // Asegúrate de que la ruta sea correcta

// Ruta de registro para pacientes
app.post('/register/paciente', async (req, res) => {
  try {
    const { username, password, nombre, apellido, fechaNacimiento, telefono, alergias, tramoFonasa, rut } = req.body;
    
    // Verifica si el paciente ya existe
    const existingPaciente = await Paciente.findOne({ username });
    if (existingPaciente) {
      return res.status(400).json({ message: 'El paciente ya está registrado.' });
    }

    // Crea un nuevo paciente
    const newPaciente = new Paciente({
      username,
      password, // Asegúrate de hashear la contraseña antes de guardarla en la base de datos
      nombre,
      apellido,
      tipo: "paciente", // Tipo por defecto para pacientes
      fechaNacimiento,
      telefono,
      alergias,
      tramoFonasa,
      rut
    });

    // Guarda el nuevo paciente en la base de datos
    await newPaciente.save();

    res.status(201).json({ message: 'Paciente registrado con éxito' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
});
