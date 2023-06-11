import { showMessage } from './helpers.js';

// Obtener el host y el puerto del servidor actual
const host = window.location.hostname;
const port = window.location.port;

// Construir la URL base
const baseUrl = `http://${host}:${port}`;

// REGISTRAR AUTO

// Obtener referencias a los elementos del formulario
const formAdd = document.getElementById('registerCarPost');
const patentInputAdd = document.getElementById('patent');
const capacityInputAdd = document.getElementById('capacity');

// Evento de envío del formulario
formAdd.addEventListener('submit', async (event) => {
    event.preventDefault(); // Evitar el envío del formulario por defecto
    // Validar los campos del formulario
    if ( !patentInputAdd.value || !capacityInputAdd.value ) {
      showMessage('Por favor, complete todos los campos', 'error');
      return;
    }
  
    try {
      // Obtener los valores de los campos del formulario
      const patent = patentInputAdd.value;
      const capacity = capacityInputAdd.value;
  
      // Crear el objeto con los valores del formulario
      const object = {
        patent,
        capacity
      };
  
      // Obtener el host y el puerto del servidor actual
      const host = window.location.hostname;
      const port = window.location.port;
  
      // Construir la URL base
      const baseUrl = `http://${host}:${port}`;
  
      // Componer la URL completa para la solicitud
      const url = `${baseUrl}/adminCars`;
  
      //campaigns/:CampaignId/focuses/:FocusId/blocks/:BlockRegistrationId/houses
  
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
        return showMessage(`Auto creado correctamente`);
  
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
const patentInputSearch = document.getElementById('patentSearch');
const capacityInputSearch = document.getElementById('capacitySearch');
const carInputSearch = document.getElementById('carSearch');

// Evento de envío del formulario
formSearch.addEventListener('submit', async (event) => {
  event.preventDefault(); // Evitar el envío del formulario por defecto

  try {
    // Obtener los valores de los campos del formulario
    const patent = patentInputSearch.value;
    const capacity = capacityInputSearch.value;
    const available = carInputSearch.checked ? false : undefined;

    // Crear el objeto con los valores del formulario
    const object = {
      ...(patent && { patent }),
      ...(capacity && { capacity }),
      ...(available !== undefined && { available })
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
