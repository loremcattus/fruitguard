import { showMessage } from './helpers.js';

// Obtener el host y el puerto del servidor actual
const host = window.location.hostname;
const port = window.location.port;

// Construir la URL base
const baseUrl = `http://${host}:${port}`;

// REGISTRARSE

// Obtener referencias a los elementos del formulario
const formAdd = document.getElementById('registerPost');
const emailInputAdd = document.getElementById('email');
const nameInputAdd = document.getElementById('name');
const runAdd = document.getElementById('run');
const passwordInputAdd = document.getElementById('password');

// Evento de envío del formulario
formAdd.addEventListener('submit', async (event) => {
    event.preventDefault(); // Evitar el envío del formulario por defecto
    // Validar los campos del formulario
    if (!emailInputAdd.value || !nameInputAdd.value || !runAdd.value || !passwordInputAdd.value) {
      showMessage('Por favor, complete todos los campos', 'error');
      return;
    }
  
    try {
      // Obtener los valores de los campos del formulario
      const email = emailInputAdd.value;
      const name = nameInputAdd.value;
      const run = runAdd.value;
      const password = passwordInputAdd.value;
  
      // Crear el objeto con los valores del formulario
      const object = {
        email,
        name,
        run,
        password
      };
  
      // Obtener el host y el puerto del servidor actual
      const host = window.location.hostname;
      const port = window.location.port;
  
      // Construir la URL base
      const baseUrl = `http://${host}:${port}`;
  
      // Componer la URL completa para la solicitud
      const url = `${baseUrl}/register`;
  
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
        return showMessage(`Cuenta creada correctamente`);
  
      } else {
        throw new Error('Error al enviar el formulario');
      }
    } catch (error) {
      // Manejar el error
      showMessage('Error al enviar el formulario', 'error');
      console.error('Error al enviar el formulario:', error);
    }
  });