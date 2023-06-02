import { showMessage } from './helpers.js';

// Obtener el host y el puerto del servidor actual
const host = window.location.hostname;
const port = window.location.port;
// Construir la URL base
const baseUrl = `http://${host}:${port}`;
const CampaignId = window.location.href.split('/').reverse()[0].split('?')[0];

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
const managerSelectEdit = document.getElementById('manager');

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const managerSelectEdit = document.getElementById('manager');
      fetch(`/api/managers/${managerSelectEdit.value}`)
        .then(response => response.json())
        .then(data => {
          data.forEach(manager => {
            const option = document.createElement('option');
            option.value = manager.id;
            option.textContent = manager.name;
            managerSelectEdit.appendChild(option);
          });
        })
        .catch(error => console.log(error));
      observer.unobserve(entry.target);
    }
  });
});

observer.observe(managerSelectEdit);

// Evento de envío del formulario
formEdit.addEventListener('submit', async (event) => {
  event.preventDefault(); // Evitar el envío del formulario por defecto

  // Obtener los valores de los campos del formulario
  const region = regionsSelectEdit.value;
  const commune = communesSelectEdit.value;
  const name = nameInputEdit.value;
  const open = openCheckboxEdit.checked ? true : false;
  const file = fileInputEdit ? fileInputEdit.files[0] : "";
  const managerId = managerSelectEdit.value;

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
    ...(file && { file }),
    ...(managerId && { managerId })
  };

  try {
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

// USERS READ

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
  const userId = this.getAttribute('user-id');
  const username = this.parentNode.querySelector('.card-left-side-top').textContent;
  const modalText = removeModal.querySelector('#modal-message');
  modalText.setAttribute('user-id-to-remove', userId);
  modalText.setAttribute('username', username);
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
  const deleteAttributes = this.parentNode.parentNode.querySelector('[user-id-to-remove]');
  const userId = deleteAttributes.getAttribute('user-id-to-remove');
  const username = deleteAttributes.getAttribute('username');
  // Obtener el Id de la campaña
  const CampaignId = window.location.href.split('/').reverse()[0].split('?')[0];
  // Componer la URL completa para la solicitud
  const url = `${baseUrl}/api/campaigns/${CampaignId}/users/${userId}`;

  // Realizar el fetch a la URL deseada con el user-id
  fetch(url, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json'
    }
  })
  .then(response => {
    if (response.ok) {
      showMessage(`${username} ha sido retirado/a de la campaña`);
      closeRemoveModal();
      document.querySelector(`[user-id="${userId}"]`).parentNode.remove();
    } else if (response.status === 404) {
      throw new Error(`${username} ya ha sido retirado/a de la campaña`);
    } else {
      throw new Error('Error al enviar el formulario');
    }
  })
  .catch(error => {
    showMessage(error.message, 'error');
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

// USERS ADD

const addModal = document.querySelector('[data-target="#addModal"]');
addModal.addEventListener('click', getNonCampaignUsers);

function getNonCampaignUsers () {
  fetch(`/api/campaigns/${CampaignId}/users/not-in/`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    },
  })
  .then(response => response.json())
  .then(data => {
    const addUsersSection = document.querySelector('.add-users-cards');
    
    // Limpiar contenido existente dentro del section
    addUsersSection.innerHTML = '';

    // Recorrer los datos y agregarlos como tarjetas dentro del section
    data.forEach(user => {
      const card = `
        <a>
          <div class="card-left-side">
            <p class="card-left-side-top">${user.name}</p>
            <p class="card-left-side-bottom">${user.role} | ${user.rut}</p>
          </div>
          <div non-campaign-user-id="${user.id}" class="card-right-side check-button">
            <input type="checkbox" class="add-user-checkbox">
          </div>
        </a>
      `;
      addUsersSection.innerHTML += card;
    });
  })
  .catch(error => {
    console.error('Error en la solicitud fetch: ', error);
  });
}
