const message = document.getElementById('message');

export const showMessage = (text, type = 'success') => {
  // Limpiar clases existentes
  message.classList.remove('alert-success', 'alert-danger');

  // Agregar clase según el tipo de mensaje
  if (type === 'success') {
    message.classList.add('alert-success');
  } else if (type === 'error') {
    message.classList.add('alert-danger');
  }

  // Mostrar el mensaje con el texto especificado
  message.textContent = text;
  message.style.display = 'block';

  // Añadir la clase 'show' para activar la transición de opacidad
  setTimeout(() => {
    message.classList.add('show');
  }, 10);

  // Ocultar el mensaje después de 5 segundos
  setTimeout(() => {
    message.classList.remove('show');
    setTimeout(() => {
      message.style.display = 'none';
    }, 500);
  }, 2000);
};