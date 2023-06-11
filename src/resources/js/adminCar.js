import { showMessage } from './helpers.js';

// Obtener el host y el puerto del servidor actual
const host = window.location.hostname;
const port = window.location.port;
// Construir la URL base
const baseUrl = `http://${host}:${port}`;
const CarId = window.location.href.split('/').reverse()[0].split('?')[0];

const message = localStorage.getItem('message');

if (message) {
  showMessage(message);
  // Limpiar el mensaje almacenado después de mostrarlo
  localStorage.removeItem('message');
}

function isNumeric(str) {
  return /\d/.test(str);
}

// UPDATE
// Obtener referencias a los elementos del formulario
const formEdit = document.getElementById('editPost');
const patentInputEdit = document.getElementById('patent');
const capacitySelectEdit = document.getElementById('capacity');
const availableCheckboxEdit = document.getElementById('available');

const wasAvailable = availableCheckboxEdit.checked ? true : false;

// Evento de envío del formulario
formEdit.addEventListener('submit', async (event) => {
  event.preventDefault(); // Evitar el envío del formulario por defecto

  // Obtener los valores de los campos del formulario
  const patent = patentInputEdit.value;
  const capacity = capacitySelectEdit.value;
  const available = availableCheckboxEdit.checked ? true : false;

  // Crear el objeto solo con los valores que vengan del formulario
  const object = {
    ...(patent && { patent }),
    ...(capacity && { capacity }),
    ...(wasAvailable != available && { available }),
  };

  if (Object.keys(object).length === 0) {
    showMessage('No hay datos para actualizar', 'error');
    return;
  };

  try {
    // Componer la URL completa para la solicitud
    const url = `${baseUrl}/api/cars/${CarId}`;

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
      localStorage.setItem('message', 'Auto actualizado con éxito');
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

// USERS DELETE

// Obtener referencias a los elementos relevantes
const removeBtns = document.querySelectorAll('.removeBtn');
if (removeBtns.length > 0) {
  const modalBackdropRemove = document.getElementById('modalBackdropRemove');
  const removeModal = document.getElementById('removeModal');
  const closeButton = document.querySelector('div.close-modal[data-dismiss="modalRemoveUser"]');
  const cancelBtn = document.querySelector('#cancelRemoveUser');
  const confirmBtn = removeModal.querySelector('#confirmRemoveUser');

  // Función para mostrar el modal y el fondo del modal
  function openRemoveModal() {
    modalBackdropRemove.style.display = '';
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
    modalBackdropRemove.style.display = 'none';
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
  modalBackdropRemove.addEventListener('click', closeRemoveModal);

  // USER SEARCH TO REMOVE
  const nameOrRunInput = document.getElementById('nameRutRemove');
  const roleSelect = document.getElementById('rolRemove');

  nameOrRunInput.addEventListener('input', performSearch);
  roleSelect.addEventListener('input', performSearch);

  function performSearch() {
    const usersToRemoveCards = document.querySelectorAll(".cards a");

    let nameOrRun = nameOrRunInput.value.toLowerCase(); // Convertir a minúsculas
    let role = roleSelect.value
    let name = '';
    let run = '';

    if (isNumeric(nameOrRun)) {
      run = nameOrRun;
    } else {
      name = nameOrRun;
    }

    const filterOptions = {
      ...(run && { run }),
      ...(name && { name }),
      ...(role && { role })
    }

    usersToRemoveCards.forEach((userToAddCard) => {
      const userName = userToAddCard.querySelector(".card-left-side-top").textContent.toLowerCase(); // Convertir a minúsculas
      const userRole = userToAddCard.querySelector(".card-left-side-bottom").textContent.split(" | ")[0].toLowerCase(); // Convertir a minúsculas
      const userRun = userToAddCard.querySelector(".card-left-side-bottom").textContent.split(" | ")[1];

      if (
        (!filterOptions.name || userName.includes(filterOptions.name)) &&
        (!filterOptions.run || userRun.includes(filterOptions.run)) &&
        (!filterOptions.role || userRole === filterOptions.role)
      ) {
        userToAddCard.style.display = ''; // Mostrar la tarjeta
      } else {
        userToAddCard.style.display = 'none'; // Ocultar la tarjeta
      }
    });
  }

}

// USERS ADD
const addModal = document.querySelector('[data-target="#addModal"]');
if (addModal) {
  addModal.addEventListener('click', getNonCampaignUsers);
  const formAdd = document.getElementById('addPost');
  formAdd.addEventListener('submit', addUsers);

  function getNonCampaignUsers() {
    fetch(`/api/campaigns/${CampaignId}/users/not-in`, {
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
          user.role = user.role.charAt(0).toUpperCase() + user.role.slice(1).toLowerCase();
          const card = `
          <a>
            <div class="card-left-side">
              <p class="card-left-side-top">${user.name}</p>
              <p class="card-left-side-bottom">${user.role} | ${user.rut}</p>
            </div>
            <div class="card-right-side check-button">
              <input non-campaign-user-id="${user.id}" type="checkbox" class="add-user-checkbox">
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

  function addUsers() {
    event.preventDefault(); // Evitar el envío del formulario por defecto

    let nonCampaignUsers = document.querySelectorAll('[non-campaign-user-id]');
    // Recorrer los elementos y obtener sus valores
    if (nonCampaignUsers) {
      var usersToAdd = [];
      nonCampaignUsers.forEach(function (nonCampaignUser) {
        if (nonCampaignUser.checked ? true : false) {
          usersToAdd.push(nonCampaignUser.getAttribute('non-campaign-user-id'));
        };
      });

      if (usersToAdd.length > 0) {

        fetch(`/api/campaigns/${CampaignId}/users`, {
          method: 'POST',
          body: JSON.stringify(usersToAdd),
          headers: {
            'Content-Type': 'application/json'
          },
        })
          .then(response => {
            if (response.status === 200) {
              localStorage.setItem('message', 'Usuario(s) añadidos a la campaña');
              location.reload();
            } else {
              throw new Error('Error al añadir usuarios');
            }
          })
          .catch(error => {
            console.error('Error en la solicitud: ', error);
            showMessage('Error al añadir los usuarios', 'error');
          });

      } else {
        showMessage('Por favor, selecciona al menos un usuario', 'error');
      }
    } else {
      showMessage('No hay usuarios para añadir a la campaña', 'error');
    }

  }

  // USER SEARCH TO ADD
  const nameOrRunInput = document.getElementById('nameRutSearch');
  const roleSelect = document.getElementById('rolSearch');

  nameOrRunInput.addEventListener('input', performSearch);
  roleSelect.addEventListener('input', performSearch);

  function performSearch() {
    const usersToAddCards = document.querySelectorAll(".cards.add-users-cards a");

    let nameOrRun = nameOrRunInput.value.toLowerCase(); // Convertir a minúsculas
    let role = roleSelect.value
    let name = '';
    let run = '';

    if (isNumeric(nameOrRun)) {
      run = nameOrRun;
    } else {
      name = nameOrRun;
    }

    const filterOptions = {
      ...(run && { run }),
      ...(name && { name }),
      ...(role && { role })
    }

    usersToAddCards.forEach((userToAddCard) => {
      const userName = userToAddCard.querySelector(".card-left-side-top").textContent.toLowerCase(); // Convertir a minúsculas
      const userRole = userToAddCard.querySelector(".card-left-side-bottom").textContent.split(" | ")[0].toLowerCase(); // Convertir a minúsculas
      const userRun = userToAddCard.querySelector(".card-left-side-bottom").textContent.split(" | ")[1];

      if (
        (!filterOptions.name || userName.includes(filterOptions.name)) &&
        (!filterOptions.run || userRun.includes(filterOptions.run)) &&
        (!filterOptions.role || userRole === filterOptions.role)
      ) {
        userToAddCard.style.display = ''; // Mostrar la tarjeta
      } else {
        userToAddCard.style.display = 'none'; // Ocultar la tarjeta
      }
    });
  }
}
