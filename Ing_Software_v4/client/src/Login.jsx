// En el archivo Login.js
import './Login.css';
import React, { useState } from 'react';

function Login({ onLogin, onError }) {
  const [rut, setRut] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ rut, password }),
      });

      const data = await response.json();

      if (response.ok) {
         onLogin({
            email: data.user.username,
            nombre: data.user.nombre,
            apellido: data.user.apellido,
            tipo: data.user.tipo,
            rut: data.user.rut,
         });
         //console.error(data.user.tipo);
      } else {
        console.error(data.message);
        onError('Error al iniciar sesión. Verifica tus credenciales.');
      }
    } catch (error) {
      console.error('Error during login:', error);
      onError('Error al iniciar sesión. Inténtalo de nuevo más tarde.');
    }
  };

  return (
    <div className="container">
      <h2>Iniciar Sesión </h2>
      <label> Rut: <input type="text" value={rut} onChange={(e) => setRut(e.target.value)} /></label>
      <label> Contraseña: <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} /></label>
      <button onClick={handleLogin}>Iniciar Sesión</button>
    </div>
  );
}

export default Login;
