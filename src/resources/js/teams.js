import { showMessage } from './helpers.js';

// Construir la URL base
const baseUrl = `${location.protocol}//${location.host}`;

// READ CARS
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

createObserver('carAdd', '/cars', (data, element) => {
  if (data.length === 0) {
    showMessage('No hay autos disponibles', 'error');
    element.disabled = true;
  } else {
    data.forEach((car) => {
      const option = document.createElement('option');
      option.value = car.id;
      option.textContent = car.patent;
      option.setAttribute('data-capacity', car.capacity);
      element.appendChild(option);
    });
  }
});

const driverSelectAdd = document.getElementById('driverAdd');
let driversFetched = false;
let couldBeDrivers = true;

document.getElementById('carAdd').addEventListener('change', (event) => {
  const selectedCarId = event.target.value;
  if (!selectedCarId) return driverSelectAdd.disabled = true;
  if (!driversFetched && couldBeDrivers) {
    fetch('/drivers')
      .then((response) => response.json())
      .then((data) => {
        driverSelectAdd.disabled = false;
        data.forEach((driver) => {
          const option = document.createElement('option');
          option.value = driver.userRegistrationId;
          option.textContent = driver.name;
          driverSelectAdd.appendChild(option);
        });
      })
      .catch((error) => {
        couldBeDrivers = false;
        return showMessage('No hay conductores disponibles', 'error');
      });
  }
});

// TODO: Al seleccionar un conductor, debe habilitar inputs para pasajeros,
// tantos como lo permita la capacidad del auto.
// También debe habilitar el select de foco, que al seleccionarlo debe hacer un fetch
// a los equipos que esten en teamId del card, y obtener todas las tasks, luego pedir
// que liste en las opciones los registros de manzanas que no han sido asignados a algún otro equipo
// Además, la opción de añadir más manzanas dentro del mismo foco o añadir otro foco y otras manzanas
// Recién en ese momento se debe enviar la información para crear el equipo
