import { showMessage } from './helpers.js';

// Obtener el host y el puerto del servidor actual
const host = window.location.hostname;
const port = window.location.port;

// Construir la URL base
const baseUrl = `http://${host}:${port}`;

const message = localStorage.getItem('message');

if (message) {
  showMessage(message);
  // Limpiar el mensaje almacenado después de mostrarlo
  localStorage.removeItem('message');
}

// REGISTRAR USUARIO

// Obtener referencias a los elementos del formulario
const formAdd = document.getElementById('registerPost');
const emailInputAdd = document.getElementById('email');
const nameInputAdd = document.getElementById('name');
const rutInputAdd = document.getElementById('rut');
const licenseInputAdd = document.getElementById('license');
const roleInputAdd = document.getElementById('role');

// Evento de envío del formulario
formAdd.addEventListener('submit', async (event) => {
    event.preventDefault(); // Evitar el envío del formulario por defecto
    // Validar los campos del formulario
    if ( !emailInputAdd.value || !nameInputAdd.value || !rutInputAdd.value || !roleInputAdd.value ) {
      showMessage('Por favor, complete todos los campos', 'error');
      return;
    }
  
    try {
      // Obtener los valores de los campos del formulario
      const name = nameInputAdd.value;
      const rut = rutInputAdd.value.replace(/\./g, '');
      const email = emailInputAdd.value;
      const role = roleInputAdd.value;
      const hasLicense = licenseInputAdd.checked;
  
      // Crear el objeto con los valores del formulario
      const object = {
        name,
        rut,
        email,
        hasLicense,
        role
      };
  
      // Obtener el host y el puerto del servidor actual
      const host = window.location.hostname;
      const port = window.location.port;
  
      // Construir la URL base
      const baseUrl = `http://${host}:${port}`;
  
      // Componer la URL completa para la solicitud
      const url = `${baseUrl}/admin-users`;
  
      // Enviar el objeto al servidor
      const response = await fetch(url, {
        method: 'POST',
        body: JSON.stringify(object),
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.status === 201) {
        // Procesar la respuesta del servidor
        localStorage.setItem('message','Usuario creado correctamente');
        // Recargar la página
        location.reload();
  
      } else if (response.status === 409) {
        return showMessage('El rut o correo ya está registrado', 'error');
      } else if (response.status === 400) {
        return showMessage('El rut es inválido', 'error');
      } else {
        throw new Error('Error al enviar el formulario');
      }
    } catch (error) {
      // Manejar el error
      showMessage('Error al enviar el formulario', 'error');
      console.error('Error al enviar el formulario:', error);
    }
  });

  
// READ

// Obtener referencias a los elementos del formulario
const formSearch = document.getElementById('searchPost');
const emailInputSearch = document.getElementById('emailSearch');
const nameInputSearch = document.getElementById('nameSearch');
const runInputSearch = document.getElementById('runSearch');
const roleInputSearch = document.getElementById('roleSearch');
const licenseInputSearch = document.getElementById('licenseSearch');

// Evento de envío del formulario
formSearch.addEventListener('submit', async (event) => {
  event.preventDefault(); // Evitar el envío del formulario por defecto

  try {
    // Obtener los valores de los campos del formulario
    const name = nameInputSearch.value;
    const run = runInputSearch.value;
    const email = emailInputSearch.value;
    const hasLicense = licenseInputSearch.checked ? false : undefined;
    const role = roleInputSearch.value;

    // Crear el objeto con los valores del formulario
    const object = {
      ...(name && { name }),
      ...(run && { run }),
      ...(email && { email }),
      ...(hasLicense !== undefined && { hasLicense }),
      ...(role && { role }),
    };

    // Serializar el objeto en formato de consulta de URL
    const queryParams = new URLSearchParams(object).toString();

    // Redirigir a la página actual con los parámetros de búsqueda en la URL
    window.location.search = queryParams;

  } catch (error) {
    // Manejar el error
    showMessage('Error al realizar la búsqueda', 'error');
    console.error('Error al realizar la búsqueda:', error);
  }

});

const rutInputRegister = document.getElementById('rut');

rutInputRegister.addEventListener('input', validateRut)

function validateRut() {
  var rutInput = document.getElementById('rut');
  var rut = rutInput.value.trim().replace(/\./g, '').replace(/-/g, '').toUpperCase();
  
  var isValid = false;
  
  // Validar formato del RUT
  if (/^[0-9]+-[0-9kK]{1}$/.test(rut)) {
    var rutDigits = rut.split('-')[0];
    var rutVerifier = rut.split('-')[1];
    
    // Validar dígito verificador
    var sum = 0;
    var multiplier = 2;
    for (var i = rutDigits.length - 1; i >= 0; i--) {
      sum += parseInt(rutDigits.charAt(i)) * multiplier;
      multiplier = multiplier === 7 ? 2 : multiplier + 1;
    }
    
    var remainder = sum % 11;
    var calculatedVerifier = String(11 - remainder === 11 ? 0 : 11 - remainder);
    
    if (calculatedVerifier === rutVerifier) {
      isValid = true;
    }
  }
  
  // Aplicar estilo al campo de entrada
  rutInput.style.borderColor = isValid ? 'red' : 'green';
}