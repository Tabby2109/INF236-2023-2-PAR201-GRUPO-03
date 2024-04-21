import React, { useState } from 'react';
import Calendar from "./Calendar";
import Login from "./Login";
import Register from "./Register";
import Register2 from "./Register_paciente";
import ExPac from './Ex_Pac';
import "./App.css";

function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [showLogin, setShowLogin] = useState(true); // Cambiado a true para mostrar el Login por defecto
  const [registerType, setRegisterType] = useState(''); // Nuevo estado para manejar el tipo de registro

  const [userDetails, setUserDetails] = useState({
    email: '',
    nombre: '',
    apellido: '',
    rut: '',
    tipo: '',
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

  const handleError = (message) => {
    setErrorMessage(message);
  };

  const handleRegisterType = (type) => {
    setRegisterType(type);
    setShowLogin(false); // Ocultar el formulario de inicio de sesión al seleccionar el tipo de registro
  };

  return (
    <div>
      <div>
        {errorMessage && (
          <div className="error-message">
            {errorMessage}
          </div>
        )}
        {loggedIn ? (
            <div>
            <div className="cerrarSesion">
              <button onClick={handleLogout}>
                Cerrar Sesión
              </button>
            </div>
            {userDetails.tipo === "paciente" ? (
              <div>
                <ExPac userDetails={userDetails} />
              </div>
            ) : ( 
              <div className="calendar-container">
                <Calendar {...userDetails} />
              </div>
            )}
          </div>
        ) : (
          <div className="page-background">
            <div className="App">
              {showLogin ? (
                <div>
                  <Login onLogin={handleLogin} onError={handleError} />
                  <p className="pregunta"> ¿No tienes sesión? </p>
                  <button onClick={() => handleRegisterType('register1')}>
                    REGISTRATE EMPLEADO
                  </button>
                  <button onClick={() => handleRegisterType('register2')}>
                    REGISTRATE PACIENTE
                  </button>
                </div>
              ) : (
                <div>
                  {registerType === 'register1' ? (
                    <Register onError={handleError} onRegister={toggleLoginView} />
                    
                  ) : (
                    <Register2 onError={handleError} onRegister={toggleLoginView} />
                  )}
                  <p className="pregunta"> ¿Ya tienes una sesión? </p>
                  <button onClick={toggleLoginView}>
                    INGRESAR
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;