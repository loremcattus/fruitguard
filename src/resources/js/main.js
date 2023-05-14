window.onload = function() {
  var breadcrumbs = document.querySelector(".breadcrumbs");
  breadcrumbs.scrollLeft = breadcrumbs.scrollWidth;

  const selects = document.querySelectorAll('select');
  const len = selects.length;
  for (let i = 0; i < len; i++) {
    const select = selects[i];
    const firstOption = select.querySelector('option:first-child');
    select.addEventListener('change', () => {
      const selectedOption = select.querySelector('option:checked');
      select.style.color = (selectedOption !== firstOption) ? 'black' : '';
    });
  }

  const modalID = 'addModal';
  const modal = document.getElementById(modalID);
  const modalBackdrop = document.getElementById('modalBackdrop');
  const modalTrigger = document.querySelector('[data-target="#'+modalID+'"]');
  const closeButton = modal.querySelector('[data-dismiss="modal"]');

  modalTrigger.addEventListener('click', openModal);
  modalBackdrop.addEventListener('click', closeModal);
  closeButton.addEventListener('click', closeModal);

  function openModal() {
    modal.style.display = 'block';
    modalBackdrop.style.display = 'block';
  }

  function closeModal() {
    modal.style.display = 'none';
    modalBackdrop.style.display = 'none';
  }

};