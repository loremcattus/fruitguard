export const singleJS = () => {
  const editButton = document.getElementById('edit');
  const cancelButton = document.getElementById('cancel-edit');
  const valuePost = document.querySelectorAll('.value-post');
  const buttonsEdit = document.querySelector('.buttons-edit');

  if (editButton) {
    editButton.addEventListener('click', function (event) {
      event.preventDefault();
      editButton.style.display = 'none';
      buttonsEdit.style.display = '';
  
      for (let i = 0; i < valuePost.length; i++) {
        const pTag = valuePost[i].querySelector('p');
        const nonPTags = valuePost[i].querySelectorAll(':scope > :not(p)');
  
        if (nonPTags.length > 0) {
          pTag.style.display = 'none';
          for (let j = 0; j < nonPTags.length; j++) {
            nonPTags[j].style.display = '';
          }
        }
      }
    });
  }

  if (cancelButton) {
    cancelButton.addEventListener('click', function (event) {
      event.preventDefault();
      editButton.style.display = '';
      buttonsEdit.style.display = 'none';
  
      for (let i = 0; i < valuePost.length; i++) {
        const pTag = valuePost[i].querySelector('p');
        const nonPTags = valuePost[i].querySelectorAll(':scope > :not(p)');
  
        if (nonPTags.length > 0) {
          pTag.style.display = '';
          for (let j = 0; j < nonPTags.length; j++) {
            nonPTags[j].style.display = 'none';
          }
        }
      }
    });
  }

  // CAMPAIGN

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

}