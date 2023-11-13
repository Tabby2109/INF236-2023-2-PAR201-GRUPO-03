import React, { useState } from 'react';
import Calendar from "./Calendar";
import Login from "./Login";
import Register from "./Register";
import "./App.css";


function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [userDetails, setUserDetails] = useState({
    email: '',
    nombre: '',
    apellido: '',
    rut: '',
    // Otros atributos que puedas tener...
  });
  const [errorMessage, setErrorMessage] = useState('');

  const toggleLoginView = () => {
    setShowLogin(!showLogin);
    setErrorMessage(''); // Limpiar el mensaje de error al cambiar la vista
  };

  const handleLogin = (userData) => {
    setLoggedIn(true);
    setUserDetails(userData);
    setErrorMessage(''); // Limpiar el mensaje de error al iniciar sesión correctamente
  };

  const handleLogout = () => {
    setLoggedIn(false);
    // También puedes restablecer el correo electrónico aquí si es necesario
  };

  const handleRegister = () => {
    // Puedes hacer algo después de registrarte si es necesario
    toggleLoginView(); // Cambia a la vista de inicio de sesión después del registro
  };

  const handleError = (message) => {
    setErrorMessage(message);
  };

  return (
    <div className="App">
      {errorMessage && (
        <div className="error-message">
          {errorMessage}
        </div>
      )}
      {loggedIn ? (
        <>
          <button onClick={handleLogout}>
            Cerrar Sesión
          </button>
          <div>
            <Calendar {...userDetails} />
          </div>
        </>
      ) : (
        <>
          {showLogin ? (
            <>
              <Login onLogin={handleLogin} onError={handleError} />
              <p> ¿No tienes sesión? </p>
              <button onClick={toggleLoginView}>
                REGISTRATE
              </button>
            </>
          ) : (
            <>
              <Register onRegister={handleRegister} onError={handleError} />
              <p> ¿Ya tienes una sesión? </p>
              <button onClick={toggleLoginView}>
                INGRESAR
              </button>
            </>
          )}
        </>
      )}
    </div>
  );
}

export default App;