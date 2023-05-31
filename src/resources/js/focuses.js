
import { showMessage } from "./helpers.js";
// CREATE

// Obtener referencias a los elementos del formulario

const formAdd = document.getElementById('addPost');
const addressInputAdd = document.getElementById('addressAdd');
// Evento de envío de formulario 

formAdd.addEventListener('submit', async (event) => {
  event.preventDefault();//Evitar el envío del formulario por defecto

  // Validar los campos de formulario 
  if (!addressInputAdd.value) {
    showMessage('Por favor, complete todos los campos', 'error');
    return;
  };

  try {
    // Obtener los valores de los campos del formulario
    const address = addressInputAdd.value;

    const object = {
      address
    };

    // Obtener el host y el puerto del servidor actual

    const host = window.location.hostname;// localhost
    const port = window.location.port;// 8000
    const pathName = window.location.pathname;// /campaings/2/focuses

    // Construir la URL base
    const baseUrl = `http://${host}:${port}`;

    // Componer la URL completa para la solicitud
    const url = `${baseUrl}/api${pathName}`;// http://localhost:8000/api/campaigns/2/focuses

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
      showMessage(`Foco "${data.address}" creada correctamente`);

      // Obtener el contenedor de las campañas
      const focusedContainer = document.querySelector('.cards');


      // Verificar si focusedContainer contiene una etiqueta 'p' dentro
      // Si existe un párrafo dentro de focusedContainer, limpiar el contenido
      if (focusedContainer.firstElementChild.tagName === 'P') {
        focusedContainer.innerHTML = '';
      };
      console.log(data);
      //Crear un nuevo elemento de campaña con los datos recibidos
      const newFocusElement = document.createElement('a');
      newFocusElement.href = `/campaigns/${data.CampaignId}/focuses/${data.id}`;
      newFocusElement.insertAdjacentHTML('beforeend',`
        <div class="card-left-side">
          <p class="card-left-side-top">${data.id} | <span class="card-left-side-top-highlight">${data.address}</span></p>
        </div>
        <div class="card-right-side">
          <p>${data.active ? 'Activo' : 'Inactivo'}</p>
        </div>
    `);
      focusedContainer.prepend(newFocusElement);

    } else {
      throw new Error('Error al enviar el formulario');
    };
  } catch (error) {

    // Manejar el error
    showMessage('Error al enviar el formulario', 'error');
    console.error('Error al enviar el formulario:', error);
  };
});


// READ 

// Obtener referencias a los elementos del formulario
const formSearch = document.getElementById('searchPost');
const addressInputSearch = document.getElementById('addressSearch');
const activeInputSearch = document.getElementById('activeSearch');

// Evento de envío del formulario
formSearch.addEventListener('submit', async (event) => {
  event.preventDefault();// Evitar el envio del formulario por defecto

  try {
    const address = addressInputSearch.value;
    const active = activeInputSearch.checked ? false : undefined;

    // Crear el objeto con los valores del formulario 

    const object = {
      ...(address && { address }),
      ...(active !== undefined && { active })
    };

    // Serializar el objeto en forato de consulta de URL
    const queryParams = new URLSearchParams(object).toString();

    // Redirigir a la pagina actual con los parametros de búsqueda en la URL
    window.location.search = queryParams;
  } catch (error) {
    //manejar el error
    showMessage('Error al realizar la búsqueda', 'error');
    console.error('Error al realizar la búsqueda:', error);
  };
});

