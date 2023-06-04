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
    const treeState = treeStateDropdownEdit.value;
    const numberTrees = numberTreesInputEdit.value;
    const units_per_sample = units_per_sampleInputEdit.value;

    const object = {
        species,
        treeState,
        numberTrees,
        units_per_sample,
    };


});