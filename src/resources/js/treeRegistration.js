import{ showMessage } from "./helpers.js";

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

    const species = especiesDropdownEdit.value;
    const tree_state = treeStateDropdownEdit.value;
    const tree_number = parseInt(numberTreesInputEdit.value);
    const units_per_sample = parseInt(units_per_sampleInputEdit.value);

    const object ={
        ...(species && {species}),
        ...(tree_state &&  {tree_state}),
        ...(tree_number && {tree_number}),
        ...(units_per_sample &&{units_per_sample}),
    };

    try{
        //obtener el host y el puerto del servidor actual 
        const host = window.location.hostname;  
        const port = window.location.port;
        

        // Construir la URL base 
        const baseUrl = `http://${host}:${port}`;

        // Obtener el resto de la pagina 
        const linkPath = window.location.pathname;

        // Componer la URL completa 
        const url = `${baseUrl}/api${linkPath}`;


        const response = await fetch(url,{
            method: 'PATCH',
            body: JSON.stringify(object),
            headers:{
                'Content-Type':'application/json'
            }
        })
        if (response.status === 200){
            // Guardar el mensaje en el almacenamiento local
            localStorage.setItem('message','Árbol actualizado con éxito');
            // Recarga la página 
            location.reload();
        } else if ( response.status === 400 ){
            return response.text().then( errorMessage => {
                showMessage(errorMessage, 'error');
            });
        } else {
            throw new Error('Error al enviar el formulario');
        }
    }catch (error){
        console.log( error );
        // Manejar el error
        showMessage('Error al enviar el formulario','error');
    }
});