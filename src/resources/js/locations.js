const regionesSelect = document.getElementById('regiones');
const comunasSelect = document.getElementById('comunas');

// Función para crear opciones de select
const crearOption = (code, text) => {
  const option = document.createElement('option');
  option.value = text;
  option.setAttribute('code', code);
  option.text = text;
  return option;
};

// Función para habilitar o deshabilitar select
const setSelectDisabled = (select, disabled) => {
  select.disabled = disabled;
  select.innerHTML = '';
  if (disabled) {
    select.add(crearOption('', 'Comuna'));
  }
};

// Función para cargar opciones de select desde una URL
const cargarOpcionesDesdeURL = (url, select, transform) => {
  fetch(url)
    .then(response => response.json())
    .then(data => {
      setSelectDisabled(select, false);
      data.forEach(item => {
        const option = transform(item);
        select.add(option);
      });
    })
    .catch(error => {
      console.error(`Error al cargar opciones desde ${url}:`, error);
      setSelectDisabled(select, true);
    });
};

// Cargar regiones
cargarOpcionesDesdeURL(
  'http://localhost:8000/dpa/regiones',
  regionesSelect,
  region => crearOption(region.codigo, region.nombre)
);

// Evento para cargar comunas al seleccionar una región
regionesSelect.addEventListener('change', () => {
  const regionId = regionesSelect.selectedOptions[0].getAttribute('code');
  if (!regionId) {
    setSelectDisabled(comunasSelect, true);
    return;
  }
  const url = `http://localhost:8000/dpa/regiones/${regionId}/comunas`;
  cargarOpcionesDesdeURL(
    url,
    comunasSelect,
    comuna => crearOption(comuna.codigo, comuna.nombre)
  );
  setSelectDisabled(comunasSelect, true);
});

// Deshabilitar selects al inicio
setSelectDisabled(regionesSelect, true);
setSelectDisabled(comunasSelect, true);
