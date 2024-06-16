import React, { useState } from 'react';
import './Register_Paciente.css';

function Register({ onRegister, onError }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [fechaNacimiento, setFechaNacimiento] = useState(''); // Nuevo estado para la fecha de nacimiento
  const [telefono, setTelefono] = useState(''); // Nuevo estado para el teléfono
  const [alergias, setAlergias] = useState(''); // Nuevo estado para las alergias
  const [tramoFonasa, setTramoFonasa] = useState(''); // Nuevo estado para el tramo de FONASA
  const [rutParte1, setRutParte1] = useState('');
  const [rutParte2, setRutParte2] = useState('');

  const handleRegister = async () => {
    try {
      const rut = `${rutParte1}-${rutParte2}`;
      console.log('Datos del formulario:', { email, password });

      const response = await fetch('http://localhost:5000/api/register/paciente', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
          nombre,
          apellido,
          fechaNacimiento,
          telefono,
          alergias,
          tramoFonasa,
          rut,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        onRegister();
      } else {
        console.error(data.message);
        onError('Error al registrarse. Asegúrate de que el correo electrónico no esté registrado.');
      }
    } catch (error) {
      console.error('Error during registration:', error);
      onError('Error al registrarse. Inténtalo de nuevo más tarde.');
    }
  };

  const handleRutParte1Change = (e) => {
    const value = e.target.value.replace(/[^0-9]/g, ''); //Solo permitir números
    setRutParte1(value);
  };

  const handleRutParte2Change = (e) => {
    const value = e.target.value.replace(/[^0-9kK]/g, ''); //Solo permitir números y 'K'
    setRutParte2(value.toUpperCase());
  };

  return (
    <div className='container'>
      <h2>Registrarse</h2>
      <label>Email: <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}/></label>
      <label>Contraseña: <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} /></label>
      <label>Nombre: <input type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} /></label>
      <label>Apellido: <input type="text" value={apellido} onChange={(e) => setApellido(e.target.value)} /></label>
      <label>Fecha de Nacimiento:<input type="date" value={fechaNacimiento} onChange={(e) => setFechaNacimiento(e.target.value)} /></label>
      <label>Teléfono:<input type="text" value={telefono} onChange={(e) => setTelefono(e.target.value)}/></label>
      <label>Alergias:<input type="text" value={alergias} onChange={(e) => setAlergias(e.target.value)}/></label>
      <label>Tramo FONASA:</label>
      <select
        value={tramoFonasa}
        onChange={(e) => setTramoFonasa(e.target.value)}
      >
        <option value="" disabled>Selecciona el tramo FONASA</option>
        <option value="A">A</option>
        <option value="B">B</option>
        <option value="C">C</option>
        <option value="D">D</option>
      </select>
      <br />
      <label>Rut:</label>
      <div className="rut-container">
        <input
          type="text"
          value={rutParte1}
          onChange={handleRutParte1Change}
          maxLength={8}
          placeholder="11111111"
          className="rut-part"
        />
        <span>-</span>
        <input
          type="text"
          value={rutParte2}
          onChange={handleRutParte2Change}
          maxLength={1}
          placeholder="K"
          className="rut-part2"
        />
      </div>
      <br />
      <button onClick={handleRegister}>Registrarse</button>
    </div>
  );
}

export default Register;