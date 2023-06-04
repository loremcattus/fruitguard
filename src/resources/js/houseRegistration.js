import { showMessage } from './helpers.js';


const message = localStorage.getItem('message');

// console.log( message);
if (message) {
  showMessage(message);
  // Limpiar el mensaje almacenado después de mostrarlo
  localStorage.removeItem('message');
}

// UPDATE
const formEdit = document.getElementById('editPost');
const addressInputEdit = document.getElementById('address');
const gridInputEdit = document.getElementById('grid');
const stateDropdownEdit = document.getElementById('state');
const areaDropdownEdit = document.getElementById('area');
const commentInputEdit = document.getElementById('comment');
// Evento de envío del formulario
formEdit.addEventListener('submit', async (event) => {
  event.preventDefault();// Evitar el envío del formulario por defecto

  //Obtener los valores de los campos del formulario 
  const address = addressInputEdit.value;
  const grid = gridInputEdit.value;
  const state = stateDropdownEdit.value;
  const area = areaDropdownEdit.value;
  const comment = commentInputEdit.value;

  const houseInfo = address ? { address } : {};
  const houseRegistrationInfo = {
    ...(grid && { grid }),
    ...(state && { state }),
    ...(area && { area }),
    ...(comment && { comment }),
  };

  const object = {
    houseInfo,
    houseRegistrationInfo
  };

  try {

    // obtener el host y el puerto del sevidor actual 
    const host = window.location.hostname;
    const port = window.location.port;

    // Contsruir la URL base 
    const baseUrl = `http://${host}:${port}`;

    // Obtener el Id del Foco 
    const HouseRegistrationId = window.location.pathname

    // Componer la URL completa para la solicitud
    const url = `${baseUrl}/api${HouseRegistrationId}`;

    // Enviar el objeto al servidor 
    const response = await fetch(url, {
      method: 'PATCH',
      body: JSON.stringify(object),
      headers: {
        'Content-Type': 'application/json'
      }
    })

    if (response.status === 200) {
      // Gueardar el mensaje en el almacenamiento local
      localStorage.setItem('message', 'Casa actualizada con éxito');
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