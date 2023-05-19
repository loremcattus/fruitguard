// This function is called when the window loads.
window.onload = function() {

  // Obtener el elemento breadcrumbs.
  const breadcrumbs = document.querySelector(".breadcrumbs");

  // Si el elemento breadcrumbs existe, desplázalo a la derecha para que el primer elemento sea visible.
  if (breadcrumbs) {
    breadcrumbs.scrollLeft = breadcrumbs.scrollWidth;
  }

  // Obtener todos los elementos select en la página.
  const selects = document.querySelectorAll('select');

  // Recorrer cada elemento select.
  for (const select of selects) {

    // Obtener la primera opción en el elemento select.
    const firstOption = select.querySelector('option:first-child');

    // Si la primera opción existe, añadir un event listener al elemento select.
    if (firstOption) {
      select.addEventListener('change', () => {

        // Obtener la opción seleccionada en el elemento select.
        const selectedOption = select.querySelector('option:checked');

        // Si la opción seleccionada no es la primera opción, establecer el color del elemento select en negro.
        if (selectedOption !== firstOption) {
          select.style.color = 'black';
        } else {
          select.style.color = '';
        }
      });
    }
  }

  // Obtener el elemento modal.
  const modalID = 'addModal';
  const modal = document.getElementById(modalID);

  // Obtener el elemento modalBackdrop.
  const modalBackdrop = document.getElementById('modalBackdrop');

  // Si tanto el elemento modal como el elemento modalBackdrop existen, añadir event listeners a ellos.
  if (modal && modalBackdrop) {

    // Añadir un event listener al elemento modalBackdrop para cerrar el modal cuando se hace clic en él.
    modalBackdrop.addEventListener('click', closeModal);

    // Obtener el elemento modalTrigger.
    const modalTrigger = document.querySelector('[data-target="#'+modalID+'"]');

    // Si el elemento modalTrigger existe, añadir un event listener para abrir el modal cuando se hace clic en él.
    if (modalTrigger) {
      modalTrigger.addEventListener('click', openModal);
    }

    // Obtener el elemento closeButton dentro del modal.
    const closeButton = modal.querySelector('[data-dismiss="modal"]');

    // Si el elemento closeButton existe, añadir un event listener para cerrar el modal cuando se hace clic en él.
    if (closeButton) {
      closeButton.addEventListener('click', closeModal);
    }

    // Definir la función openModal.
    function openModal() {
      // Establecer la propiedad display del elemento modal en block.
      modal.style.display = 'block';

      // Establecer la propiedad display del elemento modalBackdrop en block.
      modalBackdrop.style.display = 'block';
    }

    // Definir la función closeModal.
    function closeModal() {
      // Establecer la propiedad display del elemento modal en none.
      modal.style.display = 'none';

      // Establecer la propiedad display del elemento modalBackdrop en none.
      modalBackdrop.style.display = 'none';
    }
  }

  // Obtener el elemento file input.
  const fileInput = document.getElementById('file-upload');

  // Obtener el elemento file label.
  const fileLabel = document.getElementById('file-label');

  // Obtener el elemento form.
  const form = document.getElementById('addPost');

  // Si el elemento file input existe, añadir un event listener a él.
  if (fileInput) {
    fileInput.addEventListener('change', function() {

      // Obtener el nombre del archivo del elemento file input.
      const fileName = fileInput.value.split('\\').pop();

      // Establecer el texto del elemento file label con el nombre del archivo.
      fileLabel.innerText = fileName;
    });
  }

  // Si el elemento form existe, añadir un event listener a él.
  if (form) {
    form.addEventListener('reset', function() {

      // Establecer el texto del elemento file label como "Añadir mapa de la zona".
      fileLabel.innerText = 'Añadir mapa de la zona';
    });
  }
};
