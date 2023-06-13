import { showMessage } from "./helpers.js";

const message = localStorage.getItem('message');
if (message) {
  showMessage(message);
  // Limpiar el mensaje almacenado después de mostrarlo
  localStorage.removeItem('message');
}

// UPDATE 

const formEdit = document.getElementById('editPost');
const especiesDropdownEdit = document.getElementById('especies');
const treeStateDropdownEdit = document.getElementById('treeState');
const numberTreesInputEdit = document.getElementById('numberTrees');
const units_per_sampleInputEdit = document.getElementById('units_per_sample');


formEdit.addEventListener('submit', async (event) => {
  event.preventDefault(); // Evitar el envío del formulario por defecto

  let evidenceUploaded = false;
  const fileInput = document.getElementById('fileInput');
  // Obtiene el archivo seleccionado
  if (fileInput.files.length) {
    const treeRegistrationId = window.location.href.split('/').reverse()[0].split('?')[0];

    const file = fileInput.files[0];
    const formData = new FormData();
    formData.append('evidence', file);
  
    try {
      const response = await fetch(`/evidences/${treeRegistrationId}`, {
        method: 'POST',
        body: formData,
      });
  
      if (response.ok) {
        evidenceUploaded = true;
      } else {
        console.log('Error al subir la imagen.');
      }
    } catch (error) {
      console.log('Error de red:', error);
    }
  }

  const species = especiesDropdownEdit.value;
  const tree_state = treeStateDropdownEdit.value;
  const tree_number = parseInt(numberTreesInputEdit.value);
  const units_per_sample = parseInt(units_per_sampleInputEdit.value);

  const object = {
    ...(species && { species }),
    ...(tree_state && { tree_state }),
    ...(tree_number && { tree_number }),
    ...(units_per_sample && { units_per_sample }),
  };

  try {
    //obtener el host y el puerto del servidor actual 
    const host = window.location.hostname;
    const port = window.location.port;


    // Construir la URL base 
    const baseUrl = `http://${host}:${port}`;

    // Obtener el resto de la pagina 
    const linkPath = window.location.pathname;

    // Componer la URL completa 
    const url = `${baseUrl}/api${linkPath}`;


    const response = await fetch(url, {
      method: 'PATCH',
      body: JSON.stringify(object),
      headers: {
        'Content-Type': 'application/json'
      }
    })
    if (response.status === 200) {
      // Guardar el mensaje en el almacenamiento local
      localStorage.setItem('message', 'Árbol actualizado con éxito');
      // Recarga la página 
      location.reload();
    } else if (response.status === 400) {
      if (evidenceUploaded) {
        localStorage.setItem('message', 'Evidencia subida con éxito');
        location.reload();
      }
      return response.text().then(errorMessage => {
        showMessage(errorMessage, 'error');
      });
    } else if (response.status === 409) {
      return showMessage('La especie de árbol ya fue registrada previamente', 'error');
    } else {
      throw new Error('Error al enviar el formulario');
    }
  } catch (error) {
    console.log(error);
    // Manejar el error
    showMessage('Error al enviar el formulario', 'error');
  }
});

// CREATE 
// Obtener referencia a los elementos del formulario 
const formAdd = document.getElementById('addPost');
const units_per_sampleInputAdd = document.getElementById('units_per_sample');
const number_of_samplesInputAdd = document.getElementById('number_of_samples');
let wasCreated = false;
if (units_per_sampleInputAdd && units_per_sampleInputAdd.value != 0) {
  wasCreated = true;
}

// Evento de envio del formulario 
if (formAdd) {
  formAdd.addEventListener('submit', async (event) => {
    event.preventDefault(); // Evitar el envío del formulario por defecto

    // Validar los campos del formulario 
    if (!units_per_sampleInputAdd.value) {
      showMessage('Por favor, complete todos los campos', 'error');
      return;
    }
    try {
      // Obtener los valores de los campos del formulario
      const number_of_samples = number_of_samplesInputAdd.value;
      const units_per_sample = units_per_sampleInputAdd.value;

      const object = {
        number_of_samples,
        units_per_sample
      };

      // Obtener el host y el puerto del servidor actual
      const host = window.location.hostname;
      const port = window.location.port;
      const pathName = window.location.pathname;

      // Construir la URL base
      const baseUrl = `http://${host}:${port}`;

      // Componer la URL completa para la solicitud
      const url = `${baseUrl}/api${pathName}`;

      let method = 'POST';
      if (wasCreated) { method = 'PATCH' }

      // Enviar el objeto al servidor 
      const response = await fetch(url, {
        method,
        body: JSON.stringify(object),
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.status === 201) {
        localStorage.setItem('message', 'Prospecto creado con éxito');
        // Recargar la página
        location.reload();
      } else if (response.status === 200) {
        localStorage.setItem('message', 'Prospecto actualizado con éxito');
        // Recargar la página
        location.reload();
      } else {
        throw new Error('Error al enviar el formulario');
      }
    } catch (error) {
      // Manejar el error
      showMessage('Error al enviar el formulario', 'error');
      console.error('Error al enviar el formulario:', error);
    }
  });
}
