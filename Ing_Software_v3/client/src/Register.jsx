import React, { useState } from 'react';
import './Register.css';  // Asegúrate de crear este archivo y definir los estilos

function Register({ onRegister, onError }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [tipo, setTipo] = useState('');
  const [rutParte1, setRutParte1] = useState('');
  const [rutParte2, setRutParte2] = useState('');

  const handleRegister = async () => {
    try {
      const rut = `${rutParte1}-${rutParte2}`;
      console.log('Datos del formulario:', { email, password, nombre, apellido, tipo, rut });

      const response = await fetch('http://localhost:5000/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
          nombre,
          apellido,
          tipo,
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
      <label>Email:</label>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <br />
      <label>Contraseña:</label>
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <br />
      <label>Nombre:</label>
      <input
        type="text"
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
      />
      <br />
      <label>Apellido:</label>
      <input
        type="text"
        value={apellido}
        onChange={(e) => setApellido(e.target.value)}
      />
      <br />
      <label>Tipo:</label>
      <select
        value={tipo}
        onChange={(e) => setTipo(e.target.value)}
      >
        <option value="" disabled>Selecciona el tipo de cuenta</option>
        <option value="medico">Médico</option>
        <option value="jefe de unidad">Jefe de Unidad</option>
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
