// En el archivo Register.js

import React, { useState } from 'react';

function Register({ onRegister, onError }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [tipo, setTipo] = useState('');
  const [rut, setRut] = useState('');

  const handleRegister = async () => {
   try {
     console.log('Datos del formulario:', { email, password });
 
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

  return (
   <div>
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
     <input
       type="text"
       value={tipo}
       onChange={(e) => setTipo(e.target.value)}
     />
     <br />
     <label>Rut:</label>
     <input
       type="text"
       value={rut}
       onChange={(e) => setRut(e.target.value)}
     />
     <br />
     <button onClick={handleRegister}>Registrarse</button>
   </div>
 );
}

export default Register;