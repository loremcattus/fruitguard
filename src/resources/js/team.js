import { showMessage } from './helpers.js';

const deleteButton = document.getElementById('deleteTeam');

const modalBackdropRemove = document.getElementById('modalBackdropRemove');
const removeModal = document.getElementById('removeModal');
const closeButton = document.querySelector('div.close-modal[data-dismiss="modalRemove"]');
const cancelBtn = document.querySelector('#cancelRemove');
const confirmBtn = removeModal.querySelector('#confirmRemove');
const teamId = document.getElementById('team-id').textContent;

// Agregar eventos de clic a los botones de eliminación
deleteButton.addEventListener('click', openRemoveModal);

// Agregar eventos de clic a los botones de cancelar y confirmar
confirmBtn.addEventListener('click', handleConfirm);
cancelBtn.addEventListener('click', closeRemoveModal);
closeButton.addEventListener('click', closeRemoveModal);
modalBackdropRemove.addEventListener('click', closeRemoveModal);

// Función para mostrar el modal y el fondo del modal
function openRemoveModal() {
  modalBackdropRemove.style.display = '';
  removeModal.style.display = '';

  // Obtener el nombre de usuario
  const modalText = removeModal.querySelector('#modal-message');
  modalText.textContent = `¿Seguro que deseas disolver el equipo ${teamId}?`;
}

// Función para cerrar el modal y el fondo del modal
function closeRemoveModal() {
  modalBackdropRemove.style.display = 'none';
  removeModal.style.display = 'none';
}

// Función para manejar el evento de confirmación
async function handleConfirm() {
  const url = `/teams/${teamId}`; // Cambia el número de equipo según tus necesidades
  const response = await fetch(url, {
    method: 'DELETE',
  });

  if (response.ok) {
    // El equipo se eliminó correctamente
    localStorage.setItem('message', 'Equipo eliminado correctamente');
    window.location.href = '/teams';
  } else {
    // Hubo un error al eliminar el equipo
    console.error('Error al eliminar el equipo.');
    showMessage('Error al eliminar el equipo', 'error');
  }
}
