window.onload = function() {
  // Breadcrumbs
  const breadcrumbs = document.querySelector(".breadcrumbs");
  if (breadcrumbs) {
    breadcrumbs.scrollLeft = breadcrumbs.scrollWidth;
  }

  // Select classes
  const selects = document.querySelectorAll('select');
  if (selects) {
    const len = selects.length;
    for (let i = 0; i < len; i++) {
      const select = selects[i];
      const firstOption = select.querySelector('option:first-child');
      if (firstOption) {
        select.addEventListener('change', () => {
          const selectedOption = select.querySelector('option:checked');
          select.style.color = (selectedOption !== firstOption) ? 'black' : '';
        });
      }
    }
  }

  // Modal
  const modalID = 'addModal';
  const modal = document.getElementById(modalID);
  const modalBackdrop = document.getElementById('modalBackdrop');

  if (modal && modalBackdrop) {
    modalBackdrop.addEventListener('click', closeModal);

    const modalTrigger = document.querySelector('[data-target="#'+modalID+'"]');
    if (modalTrigger) {
      modalTrigger.addEventListener('click', openModal);
    }

    const closeButton = modal.querySelector('[data-dismiss="modal"]');
    if (closeButton) {
      closeButton.addEventListener('click', closeModal);
    }

    function openModal() {
      modal.style.display = 'block';
      modalBackdrop.style.display = 'block';
    }

    function closeModal() {
      modal.style.display = 'none';
      modalBackdrop.style.display = 'none';
    }
  }

  const fileInput = document.getElementById('file-upload');
  const fileLabel = document.getElementById('file-label');
  const form = document.getElementById('addPost');

  if (fileInput) {
    fileInput.addEventListener('change', function() {
      if (fileInput.value) {
        const fileName = fileInput.value.split('\\').pop();
        fileLabel.innerText = fileName;
      } else {
        fileLabel.innerText = 'Seleccionar archivo';
      }
    });
  }

  if (form) {
    form.addEventListener('reset', function() {
      fileLabel.innerText = 'Seleccionar archivo';
    });
  }

};