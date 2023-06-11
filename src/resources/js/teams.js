import { showMessage } from './helpers.js';

const message = localStorage.getItem('message');

if (message) {
  showMessage(message);
  // Limpiar el mensaje almacenado después de mostrarlo
  localStorage.removeItem('message');
}

function createObserver(elementId, apiUrl, callback) {
  const element = document.getElementById(elementId);

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        fetch(apiUrl)
          .then((response) => {
            if (response.status === 404) {
              return [];
            } else {
              return response.json();
            }
          })
          .then((data) => {
            callback(data, element);
          })
          .catch((error) => console.error(error));

        observer.unobserve(entry.target);
      }
    });
  });

  observer.observe(element);
}

async function populateDrivers(driverSelectAdd) {
  try {
    const response = await fetch('/drivers');

    if (!response.ok) {
      throw new Error('No hay conductores disponibles');
    }

    const data = await response.json();

    data.forEach((driver) => {
      const option = document.createElement('option');
      option.value = driver.userId;
      option.textContent = driver.name;
      driverSelectAdd.appendChild(option);
    });

    return true;
  } catch (error) {
    showMessage(error.message, 'error');
    return false;
  }
}

function populatePassengerSelects(carsSelectAdd, driverSelectAdd, passengerContainer) {
  const selectedCarId = carsSelectAdd.value;
  passengerContainer.innerHTML = '';

  if (!selectedCarId) {
    passengerContainer.style.display = 'none';
    return;
  }

  passengerContainer.style.display = '';
  const selectedCarCapacity = parseInt(carsSelectAdd.options[carsSelectAdd.selectedIndex].getAttribute('capacity'));

  for (let i = 1; i < selectedCarCapacity; i++) {
    const select = document.createElement('select');
    select.classList.add('full');
    select.disabled = true;
    const option = document.createElement('option');
    option.value = '';
    option.textContent = `Seleccionar pasajero ${i}`;
    select.appendChild(option);

    passengerContainer.appendChild(select);

    select.addEventListener('change', () => {
      const selectedOption = select.querySelector('option:checked');
      select.style.color = selectedOption !== option ? 'black' : '';
    });

    select.addEventListener('change', async () => {
      const selectsBelow = Array.from(passengerContainer.querySelectorAll('select')).slice(i);
      selectsBelow.forEach((selectBelow) => {
        selectBelow.disabled = true;
        const defaultTextContentOption = selectBelow.querySelector('option').textContent;
        selectBelow.innerHTML = '';
        const defaultOption = document.createElement('option');
        defaultOption.value = '';
        defaultOption.textContent = defaultTextContentOption;
        selectBelow.appendChild(defaultOption);
        const firstOptionBelow = selectBelow.querySelector('option:first-child');
        if (firstOptionBelow) {
          firstOptionBelow.selected = true;
        }
        selectBelow.style.color = '';
      });

      const lastSelect = selectsBelow[selectsBelow.length - 1];

      if (select.value && lastSelect) {
        const selectedUserIds = [driverSelectAdd.value];
        const allPassengerSelects = passengerContainer.querySelectorAll('select');
        allPassengerSelects.forEach((passengerSelect) => {
          selectedUserIds.push(passengerSelect.value);
        });

        try {
          const response = await fetch('/passengers', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(selectedUserIds)
          });

          if (response.status === 404) {
            return;
          }

          const data = await response.json();
          const currentSelect = selectsBelow[0];

          if (currentSelect) {
            const selectedValue = currentSelect.value;
            const defaultTextContentOption = currentSelect.querySelector('option').textContent;
            currentSelect.innerHTML = '';
            const defaultOption = document.createElement('option');
            defaultOption.value = '';
            defaultOption.textContent = defaultTextContentOption;
            currentSelect.appendChild(defaultOption);

            data.forEach((passenger) => {
              const option = document.createElement('option');
              option.value = passenger.userId;
              option.textContent = passenger.hasLicense ? `${passenger.name} con licencia` : passenger.name;
              currentSelect.appendChild(option);
            });

            currentSelect.value = selectedValue;

            if (!currentSelect.value) {
              defaultOption.selected = true;
            }

            currentSelect.disabled = false;
          }
        } catch (error) {
          console.error(error);
        }
      }
    });
  }
}

function populateTasksSelect(tasks) {
  const taskContainers = document.querySelectorAll('.task');

  taskContainers.forEach(taskContainer => {
    const focusSelect = taskContainer.querySelector('.focusAdd');
    const blockSelect = taskContainer.querySelector('.blockAdd');
    focusSelect.required = true;
    blockSelect.required = true;
    blockSelect.disabled = true;
    focusSelect.style.color = '';
    blockSelect.style.color = '';

    // Limpiar las opciones anteriores
    focusSelect.innerHTML = '<option value="">Foco</option>';
    blockSelect.innerHTML = '<option value="">Manzana</option>';

    focusSelect.addEventListener('change', () => {
      const defaultOption = focusSelect.querySelector('option');
      const selectedOption = focusSelect.querySelector('option:checked');
      focusSelect.style.color = selectedOption !== defaultOption ? 'black' : '';
    });

    blockSelect.addEventListener('change', () => {
      const defaultOption = blockSelect.querySelector('option');
      const selectedOption = blockSelect.querySelector('option:checked');
      blockSelect.style.color = selectedOption !== defaultOption ? 'black' : '';
    });

    // Agregar las opciones de foco
    tasks.forEach(task => {
      const option = document.createElement('option');
      option.value = task.focus;
      option.textContent = task.address;
      focusSelect.appendChild(option);
    });

    // Agregar el evento change al select de foco
    focusSelect.addEventListener('change', () => {
      const selectedFocus = focusSelect.value;

      // Limpiar las opciones anteriores de manzana
      blockSelect.innerHTML = '<option value="">Manzana</option>';

      if (selectedFocus) {
        // Obtener las tareas correspondientes al foco seleccionado
        const selectedTasks = tasks.find(task => task.focus.toString() === selectedFocus).tasks;

        // Agregar las opciones de manzana
        selectedTasks.forEach(task => {
          const option = document.createElement('option');
          option.value = task.blockRegistration;
          option.textContent = task.streets.replace("@", ", ");
          blockSelect.appendChild(option);
        });

        // Habilitar el select de manzana y mostrarlo
        blockSelect.disabled = false;
      } else {
        // Deshabilitar y ocultar el select de manzana
        blockSelect.disabled = true;
      }
    });
  });
}



async function fetchTasks() {
  try {
    const response = await fetch('/tasks');
    if (!response.ok) {
      throw new Error('Error al obtener las tareas');
    }
    return await response.json();
  } catch (error) {
    console.error(error);
    return false;
    // Manejar el error adecuadamente
  }
}


const carsSelectAdd = document.getElementById('carAdd');
const driverSelectAdd = document.getElementById('driverAdd');
const passengerContainer = document.getElementById('passengerContainer');
const tasksContainer = document.getElementById('tasksContainer');

const disableSelects = (boolean) => {
  carsSelectAdd.disabled = boolean;
  driverSelectAdd.disabled = boolean;
  if (boolean) {
    tasksContainer.style.display = 'none';
  } else {
    tasksContainer.style.display = 'flex';
    tasksContainer.style.flexDirection = 'column';
  }
}

let driversFetched = false;
let couldBeDrivers = true;
let tasksToDo = false;

createObserver('carAdd', '/cars', (data, element) => {
  if (data.length === 0) {
    showMessage('No hay autos disponibles', 'error');
    element.disabled = true;
  } else {
    data.forEach((car) => {
      const option = document.createElement('option');
      option.value = car.id;
      option.textContent = car.patent;
      option.setAttribute('capacity', car.capacity);
      element.appendChild(option);
    });
  }
});

carsSelectAdd.addEventListener('change', async () => {
  const selectedCarId = carsSelectAdd.value;
  driverSelectAdd.querySelector('option').selected = true;
  driverSelectAdd.style.color = '';

  if (!selectedCarId) {
    driverSelectAdd.disabled = true;
    passengerContainer.style.display = 'none';
    return;
  }

  if (driversFetched) {
    if (couldBeDrivers) {
      disableSelects(false);
      populatePassengerSelects(carsSelectAdd, driverSelectAdd, passengerContainer);
    } else {
      disableSelects(true);
    }
  } else {
    couldBeDrivers = await populateDrivers(driverSelectAdd);
    driversFetched = true;
    if (couldBeDrivers) {
      tasksToDo = await fetchTasks();
      if (tasksToDo) {
        disableSelects(false);
        populateTasksSelect(tasksToDo);
        populatePassengerSelects(carsSelectAdd, driverSelectAdd, passengerContainer);
      } else {
        couldBeDrivers = false;
        disableSelects(true);
      };
    } else {
      disableSelects(true);
    }
  }

});

driverSelectAdd.addEventListener('change', () => {
  const selectedDriverId = driverSelectAdd.value;
  const passengerSelects = document.querySelectorAll('#passengerContainer select');

  passengerSelects.forEach(passengerSelect => {
    passengerSelect.querySelector('option').selected = true;
    passengerSelect.disabled = true;
    passengerSelect.style.color = '';
  });

  const passengerSelect = document.querySelector('#passengerContainer select');
  passengerSelect.querySelector('option').selected = true;
  passengerSelect.style.color = '';
  if (passengerSelect && selectedDriverId) {
    const apiUrl = '/passengers';

    fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify([selectedDriverId])
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('No hay pasajeros disponibles');
        }
        passengerSelect.disabled = false;
        return response.json();
      })
      .then((data) => {
        const selectedValue = passengerSelect.value;
        const defaultTextContentOption = passengerSelect.querySelector('option').textContent;

        passengerSelect.innerHTML = '';
        const defaultOption = document.createElement('option');
        defaultOption.value = '';
        defaultOption.textContent = defaultTextContentOption;
        passengerSelect.appendChild(defaultOption);

        data.forEach((passenger) => {
          const option = document.createElement('option');
          option.value = passenger.userId;
          option.textContent = passenger.hasLicense ? passenger.name + ' con licencia' : passenger.name;
          passengerSelect.appendChild(option);
        });

        passengerSelect.value = selectedValue;

        if (!passengerSelect.value) {
          defaultOption.selected = true;
        }
      })
      .catch((error) => showMessage(error.message, 'error'));
  }
});

let addTaskDivsCount = 1;
// Function to add a new task above the task-options div
function addTask() {
  addTaskDivsCount++;
  const taskOptionsDiv = document.querySelector('.task-options');
  const newTaskDiv = createTaskDiv();

  // Insert the new task div before the task-options div
  taskOptionsDiv.parentNode.insertBefore(newTaskDiv, taskOptionsDiv);

  removeTaskButton.style.display = 'flex';
  // Call populateTasksSelect for the new task div
  populateTasksSelect(tasksToDo);

  if (addTaskDivsCount >= 5) {
    addTaskButton.style.display = 'none';
    return;
  }
}

// Function to remove the last task above the task-options div
function removeTask() {
  addTaskDivsCount--;
  addTaskButton.style.display = '';
  const taskOptionsDiv = document.querySelector('.task-options');
  const previousTaskDiv = taskOptionsDiv.previousElementSibling;

  // Remove the previous task div if it exists
  if (previousTaskDiv && previousTaskDiv.classList.contains('task')) {
    if (previousTaskDiv.previousElementSibling) {
      previousTaskDiv.parentNode.removeChild(previousTaskDiv);
    }
    const taskDivs = document.querySelectorAll('.task');
    if (taskDivs.length == 1) {
      removeTaskButton.style.display = 'none';
    };
  }
}

// Create a new task div
function createTaskDiv() {
  const newTaskDiv = document.createElement('div');
  newTaskDiv.className = 'full task';
  newTaskDiv.style.display = 'flex';
  newTaskDiv.style.gap = '0.5rem';

  // Create the focus select element
  const focusSelect = document.createElement('select');
  focusSelect.className = 'half focusAdd';
  const focusOption = document.createElement('option');
  focusOption.value = '';
  focusOption.textContent = 'Foco';
  focusSelect.appendChild(focusOption);
  newTaskDiv.appendChild(focusSelect);

  // Create the block select element
  const blockSelect = document.createElement('select');
  blockSelect.required = true;
  blockSelect.className = 'half blockAdd';
  blockSelect.disabled = true;
  const blockOption = document.createElement('option');
  blockOption.value = '';
  blockOption.textContent = 'Manzana';
  blockSelect.appendChild(blockOption);
  newTaskDiv.appendChild(blockSelect);

  return newTaskDiv;
}

// Event listener for the add-task button
const addTaskButton = document.getElementById('add-task');
addTaskButton.addEventListener('click', addTask);

// Event listener for the remove-task button
const removeTaskButton = document.getElementById('remove-task');
removeTaskButton.addEventListener('click', removeTask);


const formAdd = document.getElementById('addPost');

formAdd.addEventListener('submit', async (event) => {
  event.preventDefault();

  const carSelect = document.getElementById('carAdd');
  const driverId = document.getElementById('driverAdd');
  const passengerSelects = document.querySelectorAll('#passengerContainer select');
  const blockSelects = document.querySelectorAll('#tasksContainer .task .blockAdd');

  try {
    const blocksRegistrationId = [];
    blockSelects.forEach(blockSelect => {
      const blockRegistrationId = parseInt(blockSelect.value);
      if(blocksRegistrationId.includes(blockRegistrationId)) {
        throw new Error('Por favor, no repitas la manzana');
      }
      blocksRegistrationId.push(blockRegistrationId);
    });

    const tasks = blocksRegistrationId.join(', ');

    const usersId = [];
    usersId.push(parseInt(driverId.value));
    passengerSelects.forEach(passengerSelect => {
      if (passengerSelect.value) {
        const userRegistrationId = parseInt(passengerSelect.value);
        usersId.push(userRegistrationId);
      }
    });

    const carId = carSelect.value;

    const object = {
      tasks,
      carId,
      usersId,
    };

    const response = await fetch('/teams', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(object)
    });

    if (response.ok) {
      localStorage.setItem('message', 'Equipo creado exitosamente');
      location.reload();
    } else {
      throw new Error('Error al crear el equipo, por favor intente nuevamente');
    }

  } catch (error) {
    showMessage(error.message, 'error');
    return; // Se interrumpe la ejecución completa de la función del evento submit.
  }
});
