import { showMessage } from './helpers.js';

// Construir la URL base
const baseUrl = `${location.protocol}//${location.host}`;

// INICIAR SESIÓN

// Obtener referencias a los elementos del formulario
const formAdd = document.getElementById('loginPost');
const emailInputAdd = document.getElementById('email');
const passwordInputAdd = document.getElementById('password');

// Evento de envío del formulario
formAdd.addEventListener('submit', async (event) => {
  event.preventDefault(); // Evitar el envío del formulario por defecto

  // Validar los campos del formulario
  if (!emailInputAdd.value || !passwordInputAdd.value) {
    showMessage('Por favor, complete todos los campos', 'error');
    return;
  }

  try {
    // Obtener los valores de los campos del formulario
    const email = emailInputAdd.value;
    const password = passwordInputAdd.value;

    // Crear el objeto con los valores del formulario
    const object = {
      email,
      password
    };

    // Obtener el host y el puerto del servidor actual
    const host = window.location.hostname;
    const port = window.location.port;

    // Construir la URL base
    const baseUrl = `http://${host}:${port}`;

    // Componer la URL completa para la solicitud
    const url = `${baseUrl}/login`;

    //campaigns/:CampaignId/focuses/:FocusId/blocks/:BlockRegistrationId/houses

    // Enviar el objeto al servidor
    const response = await fetch(url, {
      method: 'POST',
      body: JSON.stringify(object),
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    if (response.status === 200) {
      // Procesar la respuesta del servidor
      window.location.href = response.url

    } else {
      throw new Error('Error al enviar el formulario');
    }
  } catch (error) {
    // Manejar el error
    showMessage('Error al enviar el formulario', 'error');
    console.error('Error al enviar el formulario:', error);
  }
});



// RECUPERAR CONTRASEÑA

// Función para validar el formato del correo electrónico
function validateEmail(email) {
  var re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

const resetPassword = document.getElementById('reset-password');
resetPassword.addEventListener('click', () => {
  const email = emailInputAdd.value.trim();
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