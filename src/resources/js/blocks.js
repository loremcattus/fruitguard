
import { showMessage } from "./helpers.js";








// CREATE

// Obtener referencias a los elementos del formulario 

const formAdd = document.getElementById('addPost');
// const streetsInputAdd = document.getElementById('streetsAdd');

// Evento de envío de formulario 


formAdd.addEventListener('submit', async (event) => {
  event.preventDefault(); // Evita el envío de formulario por defecto
  
  // ADD INPUTss
  // let input1Value = document.getElementById("streetsInput1").value;
  // let input2Value = document.getElementById("streetsInput2").value;
  // const streets = input1Value + '@' + input2Value;
  // let inputs = [];


  var inputs = document.getElementsByClassName("street-input");
  // Recorrer los elementos obtenidos
  let streetsArray = "";
  let streets = "";
  for (var i = 0; i < inputs.length; i++) {
    let inputValue = inputs[i].value.trim();
    if (i == 0) {
      streets = inputValue;
    } else {
      streets = streets + '@' + inputValue;
    }
    streetsArray = streetsArray + `<p class="card-left-side-bottom">${inputValue}</p>`;
  }
  // inputs.push(input1Value);
  // inputs.push(input2Value);
  // console.log(inputs);
  // inputs = inputs.join("@");
  // console.log(typeof inputs, inputs);


  // streetsInputAdd = inputs
  
  
  // Validar los campos de formulario 
  if (!streets) {
    showMessage('Por favor, complete todos los campos', 'error');
    return;
  };
  
  try {
    
    // Obtener los valores de los campos del formulario
    // const streets = streetsInputAdd.value;
    
    const object = {
      streets
    };
    
    // Obtener el host y el puerto del servidor actual 
    
    const host = window.location.hostname; // localhost
    const port = window.location.port; // 8000
    const pathName = window.location.pathname;// aun no se xd
    
    // Construir la URL base 
    const baseUrl = `http://${host}:${port}`;

    // Componer la URL completa para la solicitud 
    const url = `${baseUrl}/api${pathName}`;

    // Enviar el objeto al servidor 
    const response = await fetch(url, {
      method: 'POST',
      body: JSON.stringify(object),
      headers: {
        'content-Type': 'application/json'
      }
    });
    if (response.status === 201) {
      // Procesar la respuesta del servidor
      const data = await response.json();
      showMessage(`Manzana "${data.streets}" creada correctamente`);// deberia ser otro msg

      // Obtener el conetenedor de las campañas
      const blocksContainer = document.querySelector('.cards');

      // Verificar si el blocksContainer contiene una etiqueta 'p' dentro
      //si existe un párrafo dentro de focusedContainer,limpiar el contenido
      if (blocksContainer.firstElementChild.tagName === 'P') {
        blocksContainer.innerHTML = '';
      };
      console.log(data);
      //Crear un nuevo elemento de campaña con los datos recibidos
      const newBlocksElement = document.createElement('a');
      newBlocksElement.href = `/focuses/${data.FocusId}/blocks/${data.id}`;
      newBlocksElement.insertAdjacentHTML('beforeend', `
              <div class="card-left-side">
                <p class="card-left-side-top">${data.id}</p>
                ${streetsArray}
              </div>
          `);

      // Agregar el nuevo elemento de campaña al contenedor existente
      blocksContainer.prepend(newBlocksElement);
    } else if (response.status === 409) {
      throw new Error('La manzana ya ha sido registrada en el foco');
    } else {
      throw new Error('Error al enviar el formulario');
    };
  } catch (error) {
    // Manejar el error 
    showMessage(error, 'error');
    console.log('Error al enviar el formulario:', error);
  };
});

// READ 

// Obtener referencia a los elementos del formulario
const formSearch = document.getElementById('searchPost');
const streetsSearchAdd = document.getElementById('streetsSearch');

// Evento de envío de formulario 

formSearch.addEventListener('submit', async (event) => {
  event.preventDefault(); // Evitar el envio de formulario por defecto

  try {
    const streets = streetsSearchAdd.value;
    console.log(streets);

    // Crear el objeto con los valores del formulario
    const object = {
      ...(streets && { streets }),
    };

    //Serializar el objeto en formato de consulta URL
    const queryParams = new URLSearchParams(object).toString();

    // Redirigir a la pagina actual con los parametros de búsqueda en la URL
    window.location.search = queryParams;
  } catch (error) {
    // Manejar el error
    showMessage('Error al realizar la búsqueda', 'error');
    console.error('Error al realizar la búsqueda: ', error);
  };
});