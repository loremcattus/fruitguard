import { showMessage } from './helpers.js';

const message = localStorage.getItem('message');
if (message) {
  showMessage(message);
  // Limpiar el mensaje almacenado después de mostrarlo
  localStorage.removeItem('message');
}

// UPDATE
// Obtener referencias a los elementos del formulario
const formEdit = document.getElementById('editPost');
const nameInputEdit = document.getElementById('name');
const regionsSelectEdit = document.getElementById('region');
const communesSelectEdit = document.getElementById('commune');
const openCheckboxEdit = document.getElementById('open');
const fileInputEdit = document.getElementById('fileUpload');

// Evento de envío del formulario
formEdit.addEventListener('submit', async (event) => {
  event.preventDefault(); // Evitar el envío del formulario por defecto

  // Obtener los valores de los campos del formulario
  const region = regionsSelectEdit.value;
  const commune = communesSelectEdit.value;
  const name = nameInputEdit.value;
  const open = openCheckboxEdit.checked ? true : false;
  const file = fileInputEdit ? fileInputEdit.files[0] : "";

  // Validar los campos del formulario
  if (region && !commune) {
    showMessage('Por favor, seleccione la nueva región', 'error');
    return;
  }

  // Crear el objeto solo con los valores que vengan del formulario
  const object = {
    ...(region && { region }),
    ...(commune && { commune }),
    ...(name && { name }),
    ...({ open }),
    ...(file && { file })
  };

  try {
    // Obtener el host y el puerto del servidor actual
    const host = window.location.hostname;
    const port = window.location.port;

    // Construir la URL base
    const baseUrl = `http://${host}:${port}`;

    // Obtener el Id de la campaña
    const CampaignId = window.location.href.split('/').reverse()[0].split('?')[0];
    // Componer la URL completa para la solicitud
    const url = `${baseUrl}/api/campaigns/${CampaignId}`;

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
      localStorage.setItem('message', 'Campaña actualizada con éxito');
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

// USERS

// Obtener referencias a los elementos relevantes
const removeBtns = document.querySelectorAll('.removeBtn');
const modalBackdrop = document.getElementById('modalBackdropRemove');
const removeModal = document.getElementById('removeModal');
const closeButton = document.querySelector('div.close-modal[data-dismiss="modalRemoveUser"]');
const cancelBtn = document.querySelector('#cancelRemoveUser');
const confirmBtn = removeModal.querySelector('#confirmRemoveUser');

// Función para mostrar el modal y el fondo del modal
function openRemoveModal() {
  modalBackdrop.style.display = '';
  removeModal.style.display = '';

  // Obtener el nombre de usuario
  const username = this.parentNode.querySelector('.card-left-side-top').textContent;
  const modalText = removeModal.querySelector('#modal-message');
  modalText.textContent = `¿Seguro que deseas quitar a ${username} de la campaña?`;
}

// Función para cerrar el modal y el fondo del modal
function closeRemoveModal() {
  modalBackdrop.style.display = 'none';
  removeModal.style.display = 'none';
}

// Función para manejar el evento de confirmación
function handleConfirm() {
  // Obtener el user-id del elemento padre del botón
  const userId = this.parentNode.getAttribute('user-id');

  // Realizar el fetch a la URL deseada con el user-id
  fetch('tu_url', {
    method: 'DELETE',
    body: JSON.stringify({ userId }),
    headers: {
      'Content-Type': 'application/json'
    }
  })
    .then(response => {
      // Manejar la respuesta del servidor
    })
    .catch(error => {
      // Manejar el error
    });
}

// Agregar eventos de clic a los botones de eliminación
removeBtns.forEach(btn => {
  btn.addEventListener('click', openRemoveModal);
});

// Agregar eventos de clic a los botones de cancelar y confirmar
cancelBtn.addEventListener('click', closeRemoveModal);
confirmBtn.addEventListener('click', handleConfirm);
closeButton.addEventListener('click', closeRemoveModal);
modalBackdrop.addEventListener('click', closeRemoveModal);
