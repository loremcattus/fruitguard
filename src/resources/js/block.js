import { showMessage } from "./helpers.js";

const message = localStorage.getItem('message');

if (message) {
  showMessage(message);
  // Limpiar el mensaje almacenado después de mostrarlo
  localStorage.removeItem('message');
}

const cancelButton = document.getElementById('cancel-edit');
cancelButton.addEventListener('click', function (event) {
  location.reload();
});


// UPDATE 
const formEdit = document.getElementById('editPost');
const countInitialStreets = document.querySelectorAll('.street-input');

// Evento de envío del formulario
formEdit.addEventListener('submit', async (event) => {
  event.preventDefault();// Evitar el envío del formulario por defecto

  let inputs = document.getElementsByClassName("street-input");
  let streets = '';
  const placeholders = [];
  const inputValues = [];

  // Obtener y ordenar los valores de los inputs
  for (let i = 0; i < inputs.length; i++) {
    const placeholder = inputs[i].placeholder;
    placeholders.push(placeholder);

    let inputValue = inputs[i].value.trim();
    if (!inputValue) {
      if (!placeholder) {
        showMessage('Por favor, no deje calles vacías', 'error');
        return;
      }
      inputValue = placeholder;
    }
    inputValues.push(inputValue);
  }

  // Ordenar el array inputValues
  inputValues.sort();

  // Formar la variable "streets" con los valores ordenados
  for (let i = 0; i < inputValues.length; i++) {
    if (i === 0) {
      streets = inputValues[i];
    } else {
      streets = streets + '@' + inputValues[i];
    }
  }

  if (streets == placeholders.join('@') && placeholders.length == countInitialStreets.length) {
    return showMessage('No hay datos para actualizar', 'error');
  }

  // Obtener los valores de los campos del formulario

  // Validar los campos del formulario

  // Crear el objeto solo con los valores que venga del formulario 
  const object = {
    streets
  };

  try {
    // obtener el host y el puerto del sevidor actual 

    const host = window.location.hostname;
    const port = window.location.port;

    // Contsruir la URL base 
    const baseUrl = `http://${host}:${port}`;

    // Obtener el Id del Foco 
    const BlockId = window.location.pathname

    // Componer la URL completa para la solicitud 
    const url = `${baseUrl}/api${BlockId}`;

    // Enviar el objeto al servidor  
    const response = await fetch(url, {
      method: 'PATCH',
      body: JSON.stringify(object),
      headers: {
        'Content-Type': 'application/json'
      }
    })
    if (response.status === 200) {
      // Gueardar el mensaje en el almacenamiento local
      localStorage.setItem('message', 'Manzana actualizada con éxito');
      // Recargar la página 
      location.reload();
    } else if (response.status === 409) {
      showMessage('La manzana ya ha sido registrada en el foco', 'error');
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

// STREETS ADD/REMOVE

const addStreetButton = document.getElementById('add-street');
const streetContainer = document.getElementById('editPost');

// Agregar controladores de eventos a los elementos remove-street existentes
const removeStreetDivs = document.querySelectorAll('.remove-street-edit');
removeStreetDivs.forEach((removeStreetDiv) => {
  removeStreetDiv.addEventListener('click', () => {
    const streetDiv = removeStreetDiv.parentNode.parentNode;
    streetDiv.remove();
    if (streetContainer.querySelectorAll('.street-can-be-remove').length < 5) {
      addStreetButton.style.display = '';
    }
  });
});

addStreetButton.addEventListener('click', () => {
  const streetDivs = streetContainer.querySelectorAll('.street-can-be-remove');
  const streetCount = streetDivs.length;

  if (streetCount < 5) {
    // Crear el elemento div con la clase "item-post" y "street-can-be-remove"
    const streetDiv = document.createElement('div');
    streetDiv.classList.add('item-post', 'street-can-be-remove');

    // Crear el elemento div con la clase "value-post-edit" y "value-post"
    const valuePostEdit = document.createElement('div');
    valuePostEdit.classList.add('value-post-edit', 'value-post');

    // Crear el elemento input con la clase "street-input"
    const streetInput = document.createElement('input');
    streetInput.classList.add('half', 'street-input');
    streetInput.type = 'text';
    // streetInput.placeholder = 'Calle nueva';

    // Crear el elemento div con la clase "remove-street-edit"
    const removeStreetDiv = document.createElement('div');
    removeStreetDiv.classList.add('remove-street-edit');

    removeStreetDiv.addEventListener('click', () => {
      streetDiv.remove();
      if (streetContainer.querySelectorAll('.street-can-be-remove').length < 5) {
        addStreetButton.style.display = '';
      }
    });

    // Añadir los elementos al contenedor de calles
    valuePostEdit.appendChild(streetInput);
    valuePostEdit.appendChild(removeStreetDiv);
    streetDiv.appendChild(valuePostEdit);

    const addStreetContainer = document.getElementById('add-street-container');
    addStreetContainer.parentNode.insertBefore(streetDiv, addStreetContainer);

    if (streetCount + 1 === 4) {
      addStreetButton.style.display = 'none';
    }
  }
});


