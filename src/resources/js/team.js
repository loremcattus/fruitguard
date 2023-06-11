import { showMessage } from './helpers.js';

const deleteButton = document.getElementById('deleteTeam');

deleteButton.addEventListener('click', async () => {
  const TeamId = window.location.href.split('/').reverse()[0].split('?')[0];
  const url = `/teams/${TeamId}`; // Cambia el número de equipo según tus necesidades
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
});
