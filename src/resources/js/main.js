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
  document.querySelector('[data-target="#'+modalID+'"]').addEventListener("click", openModal);
  function openModal() {
    document.getElementById(modalID).style.display = 'block';
  }

};