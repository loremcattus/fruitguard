import { showMessage } from './helpers.js';

// CREATE

// Obtener referencias a los elementos del formulario
const formAdd = document.getElementById('addPost');
const speciesInputAdd = document.getElementById('speciesAdd');
const treeStateInputAdd = document.getElementById('treeStateAdd');
const numberTreesAdd = document.getElementById('numberTreesAdd');

// Evento de envío del formulario
formAdd.addEventListener('submit', async (event) => {
  event.preventDefault(); // Evitar el envío del formulario por defecto

  // Validar los campos del formulario
  if (!speciesInputAdd.value || !treeStateInputAdd.value || !numberTreesAdd.value) {
    showMessage('Por favor, complete todos los campos', 'error');
    return;
  }

  try {
    // Obtener los valores de los campos del formulario
    const species = speciesInputAdd.value;
    const treeState = treeStateInputAdd.value;
    const numberTrees = numberTreesAdd.value;

    // Crear el objeto con los valores del formulario
    const object = {
      species,
      treeState,
      numberTrees
    };

    // Obtener el host y el puerto del servidor actual
    const host = window.location.hostname;
    const port = window.location.port;
    const pathName = window.location.pathname;

    // Construir la URL base
    const baseUrl = `http://${host}:${port}`;

    // Componer la URL completa para la solicitud
    const url = `${baseUrl}/api${pathName}`;

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
      const data = await response.json();
      showMessage(`Casa "${data.species}" creada correctamente`);

      // Obtener el contenedor de las campañas
      const treeContainer = document.querySelector('.cards');

      // Verificar si treeContainer contiene una etiqueta 'p' dentro
      // Si existe un párrafo dentro de treeContainer, limpiar el contenido
      if (treeContainer.firstElementChild.tagName === 'P') {
        treeContainer.innerHTML = '';
      }

      // Crear un nuevo elemento de campaña con los datos recibidos
      const newTreeElement = document.createElement('a');
      newTreeElement.href = `/houses/${data.idHouseRegistration}`;
      newTreeElement.insertAdjacentHTML('beforeend', `
			<div class="card-left-side">
				<p class="card-left-side-top">${data.species}</p>
				<p class="card-left-side-bottom">${data.treeStates}</p>
			</div>
      `);

      // Agregar el nuevo elemento de campaña al contenedor existente
      treeContainer.prepend(newTreeElement);

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
const speciesInputSearch = document.getElementById('speciesSearch');
const treeStateInputSearch = document.getElementById('treeStateSearch');

// Evento de envío del formulario
formSearch.addEventListener('submit', async (event) => {
  event.preventDefault(); // Evitar el envío del formulario por defecto

  try {
    // Obtener los valores de los campos del formulario
    const species = speciesInputSearch.value;
    const treeState = treeStateInputSearch.value;

    // Crear el objeto con los valores del formulario
    const object = {
      ...(species && { species }),
      ...(treeState && { treeState })
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
