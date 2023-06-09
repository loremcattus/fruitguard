import { showMessage } from "./helpers.js";

const message = localStorage.getItem('message');

if (message) {
  showMessage(message);
  // Limpiar el mensaje almacenado después de mostrarlo
  localStorage.removeItem('message');
}

// Update
const formEdit = document.getElementById('editPost');
const nameInputEdit = document.getElementById('nameInput');
const emailInputEdit = document.getElementById('emailInput');
const passwordInputEdit =document.getElementById('passwordInput');
const hasLicenseCheckboxEdit = document.getElementById('hasLicenseCheckbox');

const wasLicense = hasLicenseCheckboxEdit.checked ? true : false;


// Evento de envío de formulario 
formEdit.addEventListener('submit', async (event) =>{
    event.preventDefault(); // Evitar el envío del formulario por defecto
    
    // Obtener los valores de los campos del formulario
    const name = nameInputEdit.value;
    const email = emailInputEdit.value;
    const password = passwordInputEdit.value;
    const hasLicense = hasLicenseCheckboxEdit.checked ? true : false ;
    
    
    
    // Validar los campos del formulario 
    const object ={
        ...(name && { name }),
        ...(email && { email }),
        ...(password && { password }),
        ...(wasLicense != hasLicense && { hasLicense }), 
    };

    if(Object.keys(object).length === 0){
        showMessage('No hay datos para actualizar','error');
        return;
    };

    try{
        // Obtener el host y el puerto del servidor actual 
        const host = window.location.hostname;
        const port = window.location.port;

        // Construir la url base 
        const baseUrl = `http://${host}:${port}`;
        const userId = window.location.pathname;

        // Componer la Url completa para la solicitud 
        const url = `${baseUrl}/api${userId}`;
        console.log(url);

        // Enviar el objeto al seridor
        const response = await fetch(url,{
            method:'PATCH',
            body: JSON.stringify(object),
            headers:{
                'Content-Type':'application/json'
            }
        })

        if ( response.status === 200){
            // Guardar el mensaje en el almacenamiento local 
            localStorage.setItem('message','Usuario actualizado');
            // Recargar la página
            location.reload();
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