import { showMessage } from './helpers.js';

// Construir la URL base
const baseUrl = `${location.protocol}//${location.host}`;

// INICIAR SESIÓN

// Obtener referencias a los elementos del formulario
const formAdd = document.getElementById('loginPost');
const emailInput = document.getElementById('email');

// RECUPERAR CONTRASEÑA

// Función para validar el formato del correo electrónico
function validateEmail(email) {
  var re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

const resetPassword = document.getElementById('reset-password');
resetPassword.addEventListener('click', () => {
  const email = emailInput.value.trim();
  if (!email) return showMessage('Por favor, ingresa tu correo', 'error');
  if (!validateEmail(email)) return showMessage('Correo inválido', 'error');

  const url = `${baseUrl}/api/users/reset-password`;
  fetch(url, {
    method: 'POST',
    body: JSON.stringify({ email }),
    headers: {
      'Content-Type': 'application/json'
    }
  })
    .then(response => {
      if (response.ok) {
        showMessage('Se ha enviado un mensaje a tu correo');
      } else if (response.status === 404) {
        throw new Error('El correo ingresado no está registrado');
      } else {
        throw new Error('Error al recuperar la contraseña');
      }
    })
    .catch(error => {
      showMessage(error.message, 'error');
    });

});