import { showMessage } from './helpers.js';

// CREATE

// Obtener referencias a los elementos del formulario
const formAdd = document.getElementById('addPost');
const addressInputAdd = document.getElementById('addressAdd');
const gridInputAdd = document.getElementById('gridAdd');
const areaInputAdd = document.getElementById('areaAdd');
const stateInputAdd = document.getElementById('stateAdd');
const commentInputAdd = document.getElementById('commentAdd');

// Evento de envío del formulario
formAdd.addEventListener('submit', async (event) => {
  event.preventDefault(); // Evitar el envío del formulario por defecto

  // Validar los campos del formulario
  if (!addressInputAdd.value || !gridInputAdd.value || !areaInputAdd.value || !stateInputAdd.value || !commentInputAdd.value) {
    showMessage('Por favor, complete todos los campos', 'error');
    return;
  }

  try {
    // Obtener los valores de los campos del formulario
    const address = addressInputAdd.value;
    const grid = gridInputAdd.value;
    const area_id = areaInputAdd.value;
    const state_id = stateInputAdd.value;
    const comment = commentInputAdd.value;

    // Crear el objeto con los valores del formulario
    const object = {
        address,
        grid,
        area_id,
        state_id,
        comment
    };

    // Obtener el host y el puerto del servidor actual
    const host = window.location.hostname;
    const port = window.location.port;

    // Construir la URL base
    const baseUrl = `http://${host}:${port}`;

    // Componer la URL completa para la solicitud
    const url = `${baseUrl}/api/campaigns`;

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
      showMessage(`Casa "${data.address}" creada correctamente`);

      // Obtener el contenedor de las campañas
      const housesContainer = document.querySelector('.cards');

      // Verificar si housesContainer contiene una etiqueta 'p' dentro
      // Si existe un párrafo dentro de housesContainer, limpiar el contenido
      if (housesContainer.firstElementChild.tagName === 'P') {
        housesContainer.innerHTML = '';
      }

      // Crear un nuevo elemento de campaña con los datos recibidos
      const newHouseElement = document.createElement('a');
      newHouseElement.href = `/houses/${data.id}`;
      newHouseElement.insertAdjacentHTML('beforeend', `
        <div class="card-left-side">
            <p class="card-left-side-top"><%= formattedHouseRegistration[i].id %> | <span class="card-left-side-top-highlight"><%= formattedHouseRegistration[i].state_id.charAt(0).toUpperCase() + formattedHouseRegistration[i].state_id.slice(1) %></span></p>
            <p class="card-left-side-bottom"> Grilla <%= formattedHouseRegistration[i].grid %> > Area <%= formattedHouseRegistration[i].area_id %></p>
        </div>
      `);

      // Agregar el nuevo elemento de campaña al contenedor existente
      housesContainer.prepend(newHouseElement);

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
const idOrAddressInputSearch = document.getElementById('idOrAddressSearch');
const gridInputSearch = document.getElementById('gridSearch');
const stateInputSearch = document.getElementById('stateSearch');
const areaInputSearch = document.getElementById('areaSearch');
//const sampledInputSearch = document.getElementById('sampledSearch');

// Evento de envío del formulario
formSearch.addEventListener('submit', async (event) => {
  event.preventDefault(); // Evitar el envío del formulario por defecto

  try {
    // Obtener los valores de los campos del formulario
    const idOrAddress = idOrAddressInputSearch.value;
    const grid = gridInputSearch.value;
    const state_id = stateInputSearch.value;
    const area_id = areaInputSearch.value;
    //const sampled = sampledInputSearch.checked ? false : undefined;

    // Crear el objeto con los valores del formulario
    const object = {
      ...(idOrAddress && { idOrAddress }),
      ...(grid && { grid }),
      ...(state_id && { state_id }),
      ...(area_id && { area_id }),
      //...(sampled !== undefined && { sampled })
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
