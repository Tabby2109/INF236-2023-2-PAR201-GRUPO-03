// Importa el modelo de usuario
const User = require('./Models/user');

// Ruta de registro (ejemplo)
app.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    
    // Verifica si el usuario ya existe
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return res.status(400).json({ message: 'El usuario ya existe.' });
    }

    // Crea un nuevo usuario
    const newUser = new User({
      username,
      email,
      password,
    });

    // Guarda el nuevo usuario en la base de datos
    await newUser.save();

    res.status(201).json({ message: 'Usuario registrado con éxito' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
});
