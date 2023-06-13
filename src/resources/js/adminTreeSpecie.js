import { showMessage } from './helpers.js';

// Obtener el host y el puerto del servidor actual
const host = window.location.hostname;
const port = window.location.port;
// Construir la URL base
const baseUrl = `http://${host}:${port}`;
const TreeSpeciesId = window.location.href.split('/').reverse()[0].split('?')[0];

const message = localStorage.getItem('message');

if (message) {
  showMessage(message);
  // Limpiar el mensaje almacenado después de mostrarlo
  localStorage.removeItem('message');
}

// UPDATE
// Obtener referencias a los elementos del formulario
const formEdit = document.getElementById('editPost');
const speciesInputEdit = document.getElementById('species');

// Evento de envío del formulario
formEdit.addEventListener('submit', async (event) => {
  event.preventDefault(); // Evitar el envío del formulario por defecto

  // Obtener los valores de los campos del formulario
  const species = speciesInputEdit.value;

  // Crear el objeto solo con los valores que vengan del formulario
  const object = {
    ...(species && { species }),
  };

  if (Object.keys(object).length === 0) {
    showMessage('No hay datos para actualizar', 'error');
    return;
  };

  try {
    // Componer la URL completa para la solicitud
    const url = `${baseUrl}/api/admin-tree-species/${TreeSpeciesId}`;

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
      localStorage.setItem('message', 'Especie de árbol actualizada con éxito');
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


