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

function isNumeric(str) {
  return /\d/.test(str);
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

const wasOpen = openCheckboxEdit.checked ? true : false;

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const managerSelectEdit = document.getElementById('manager');
      fetch(`/api/managers/${managerSelectEdit.getAttribute('currentManagerId')}`)
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
    showMessage('Por favor, seleccione la nueva comuna', 'error');
    return;
  }
  // Crear el objeto solo con los valores que vengan del formulario
  const object = {
    ...(region && { region }),
    ...(commune && { commune }),
    ...(name && { name }),
    ...(wasOpen != open && { open }),
    ...(file && { file }),
    ...(managerId && { managerId })
  };

  if (Object.keys(object).length === 0) {
    showMessage('No hay datos para actualizar', 'error');
    return;
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

// GENERATE REPORT

// 1. Escucha el evento de clic en tu botón
const generateReportButton = document.getElementById('generateReport');
generateReportButton.addEventListener('click', fetchDataAndDownloadExcel);

function fetchDataAndDownloadExcel() {
  fetch(`/api/campaigns/${CampaignId}`)
    .then(response => response.json())
    .then(data => {
      // Convierte el JSON en un formato de tabla de Excel XLSX
      const workbook = convertJsonToXlsx(data);

      // Crea un archivo XLSX
      const excelBuffer = window.XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
      const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `campaign_${CampaignId}.xlsx`;

      link.click();
      window.URL.revokeObjectURL(url);
    })
    .catch(error => {
      console.error('Error al obtener los datos:', error);
    });
}

// Asegúrate de que la librería SheetJS esté cargada antes de ejecutar este código
function convertJsonToXlsx(jsonData) {
  const workbook = XLSX.utils.book_new();
  const sheetData = [];

  for (const key in jsonData) {
    if (jsonData.hasOwnProperty(key)) {
      let value = jsonData[key];
      
      // Si el valor es un array, conviértelo en una cadena separada por comas
      if (Array.isArray(value)) {
        value = value.join(', ');
      }
      
      // Agrega la fila vertical a la hoja de datos
      const row = [key, value];
      sheetData.push(row);
    }
  }

  const worksheet = XLSX.utils.aoa_to_sheet(sheetData);
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');

  return workbook;
}
