import { showMessage } from "./helpers.js";

const message = localStorage.getItem('message');

if (message) {
  showMessage(message);
  // Limpiar el mensaje almacenado después de mostrarlo
  localStorage.removeItem('message');
}

const formEdit = document.getElementById('editPost');
let wasChecked = document.getElementById('has-fly');
wasChecked = wasChecked.checked;

if (formEdit) {
  formEdit.addEventListener('submit', async (event) => {
    event.preventDefault(); // Evitar el envío del formulario por defecto
    
    const id = document.getElementById('prospectus-id').textContent;
    const weight = document.getElementById('weight').value;
    let hasFly = document.getElementById('has-fly').checked;
  
    hasFly = wasChecked != hasFly ? hasFly : null;

    const data = {
      weight,
      hasFly
    };

    if ((hasFly == null) && (weight == '')) return showMessage('No hay datos para actualizar', 'error');

    try {
      const response = await fetch(`/prospects/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });
  
      if (!response.ok) throw new Error('Error al editar el prospecto');
  
      localStorage.setItem('message', 'Prospecto actualizado con éxito');
      location.reload();
  
    } catch (error) {
      console.error(error);
    }
  });
}
