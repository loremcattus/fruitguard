import { showMessage } from './helpers.js';

// CREATE

// Obtener referencias a los elementos del formulario
const formAdd = document.getElementById('addPost');
const regionsSelectAdd = document.getElementById('regionAdd');
const communesSelectAdd = document.getElementById('communeAdd');
const nameInputAdd = document.getElementById('nameAdd');
const fileInputAdd = document.getElementById('file-upload');

// Evento de envío del formulario
formAdd.addEventListener('submit', async (event) => {
  event.preventDefault(); // Evitar el envío del formulario por defecto

  // Validar los campos del formulario
  if (!regionsSelectAdd.value || !communesSelectAdd.value || !nameInputAdd.value) {
    showMessage('Por favor, complete todos los campos', 'error');
    return;
  }

  try {
    // Obtener los valores de los campos del formulario
    const region = regionsSelectAdd.value;
    const commune = communesSelectAdd.value;
    const name = nameInputAdd.value;
    const file = fileInputAdd.files[0];

    // Crear el objeto con los valores del formulario
    const object = {
      region,
      commune,
      name,
      file
    };

    // Enviar el objeto al servidor
    const response = await fetch('http://localhost:8000/api/campaigns', {
      method: 'POST',
      body: JSON.stringify(object),
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (response.status === 201) {
      // Procesar la respuesta del servidor
      const data = await response.json();
      showMessage(`Campaña "${data.name}" creada correctamente`);

      // Obtener el contenedor de las campañas
      const campaignsContainer = document.querySelector('.cards');

      // Verificar si campaignsContainer contiene una etiqueta 'p' dentro
      // Si existe un párrafo dentro de campaignsContainer, limpiar el contenido
      if (campaignsContainer.firstElementChild.tagName === 'P') {
        campaignsContainer.innerHTML = '';
      }

      // Crear un nuevo elemento de campaña con los datos recibidos
      const newCampaignElement = document.createElement('a');
      newCampaignElement.href = '#';
      newCampaignElement.insertAdjacentHTML('beforeend', `
        <div class="card-left-side">
          <p class="card-left-side-top">${data.id} | <span class="card-left-side-top-highlight">${data.name}</span></p>
          <p class="card-left-side-bottom">${data.region} > ${data.commune}</p>
        </div>
        <div class="card-right-side">
          <p>${data.open ? 'Abierta' : 'Cerrada'}</p>
        </div>
      `);

      // Agregar el nuevo elemento de campaña al contenedor existente
      campaignsContainer.prepend(newCampaignElement);

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
const regionsSelectSearch = document.getElementById('regionSearch');
const communesSelectSearch = document.getElementById('communeSearch');
const nameInputSearch = document.getElementById('nameSearch');
const openInputSearch = document.getElementById('openSearch');

// Evento de envío del formulario
formSearch.addEventListener('submit', async (event) => {
  event.preventDefault(); // Evitar el envío del formulario por defecto

  try {
    // Obtener los valores de los campos del formulario
    const region = regionsSelectSearch.value;
    const commune = communesSelectSearch.value;
    const name = nameInputSearch.value;
    const open = openInputSearch.checked ? false : undefined;

    // Crear el objeto con los valores del formulario
    const object = {
      ...(region && { region }),
      ...(commune && { commune }),
      ...(name && { name }),
      ...(open !== undefined && { open })
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
