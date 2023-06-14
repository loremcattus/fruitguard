import { showMessage } from './helpers.js';

// Obtener el host y el puerto del servidor actual
const host = window.location.hostname;
const port = window.location.port;
// Construir la URL base
const baseUrl = `http://${host}:${port}`;
const UserId = window.location.href.split('/').reverse()[0].split('?')[0];

const message = localStorage.getItem('message');

if (message) {
  showMessage(message);
  // Limpiar el mensaje almacenado después de mostrarlo
  localStorage.removeItem('message');
}

function isNumeric(str) {
  return /\d/.test(str);
}

// UPDATE
// Obtener referencias a los elementos del formulario
const formEdit = document.getElementById('editPost');
const nameInputEdit = document.getElementById('name');
const rutSelectEdit = document.getElementById('rut');
const emailSelectEdit = document.getElementById('email');
const licenseCheckboxEdit = document.getElementById('hasLicense');
const roleSelectEdit = document.getElementById('role');
const availableInput = document.getElementById('available');

const wasDestroyed = availableInput.checked ? true : false;
const wasLicense = licenseCheckboxEdit.checked ? true : false;

// Evento de envío del formulario
formEdit.addEventListener('submit', async (event) => {
  event.preventDefault(); // Evitar el envío del formulario por defecto

  const destroyUser = availableInput.checked ? true : false;

  // Obtener los valores de los campos del formulario
  const name = nameInputEdit.value;
  const rut = rutSelectEdit.value;
  const email = emailSelectEdit.value;
  const hasLicense = licenseCheckboxEdit.checked ? true : false;
  const role = roleSelectEdit.value;

  // TODO: separar rut en run y dvRun
  let object = {};
  if (wasDestroyed != destroyUser) {
    object = { destroyUser };
  } else {
    // Crear el objeto solo con los valores que vengan del formulario
    object = {
      ...(name && { name }),
      ...(rut && { rut }),
      ...(email && { email }),
      ...(wasLicense != hasLicense && { hasLicense }),
      ...(role && { role }),
    };
  }

  if (Object.keys(object).length === 0) {
    showMessage('No hay datos para actualizar', 'error');
    return;
  };

  try {
    // Componer la URL completa para la solicitud
    const url = `${baseUrl}/api/users/${UserId}`;

    // Enviar el objeto al servidor
    const response = await fetch(url, {
      method: 'PATCH',
      body: JSON.stringify(object),
      headers: {
        'Content-Type': 'application/json'
      }
    })

    if (response.status === 200) {
      // Guardar el mensaje en el almacenamiento local
      localStorage.setItem('message', 'Usuario actualizado con éxito');
      // Recargar la página
      location.reload();
    } else if (response.status === 400) {
      return response.text().then(errorMessage => {
        showMessage(errorMessage, 'error');
      });
    } else {
      throw new Error('Error al enviar el formulario');
    }
  } catch (error) {
    // Manejar el error
    showMessage('Error al enviar el formulario', 'error');
  }
});


