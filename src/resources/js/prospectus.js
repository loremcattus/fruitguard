import { showMessage } from "./helpers.js";

const message = localStorage.getItem('message');

if (message) {
  showMessage(message);
  // Limpiar el mensaje almacenado después de mostrarlo
  localStorage.removeItem('message');
}


// CREATE 
// Obtener referencia a los elementos del formulario 
const formAdd = document.getElementById('addPost');
const units_per_sampleInputAdd = document.getElementById('units_per_sample');

// Evento de envio del formulario 

formAdd.addEventListener('submit', async (event) =>{
    event.preventDefault(); // Evitar el envío del formulario por defecto
    
    // Validar los campos del formulario 
    if( !units_per_sampleInputAdd.value ){
        showMessage('Por favor, complete todos los campos','error');
        return;
    }
    try{
        // Obtener los valores de los campos del formulario
        const units_per_sample = units_per_sampleInputAdd.value;
        
        const object = {
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

        // Enviar el objeto al servidor 
        const response = await fetch(url,{
            method:'POST',
            body: JSON.stringify(object),
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if ( response.status === 201 ){
            localStorage.setItem('message', 'Campaña actualizada con éxito');
            // Recargar la página
            location.reload();
        } else{
            throw new Error('Error al enviar el formulario');
        }
    } catch ( error ) {
        // Manejar el error
        showMessage('Error al enviar el formulario','error');
        console.error('Error al enviar el formulario:', error);
    }
});