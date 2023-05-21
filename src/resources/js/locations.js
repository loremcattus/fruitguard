const regionesSelects = document.querySelectorAll('.region-select');
const comunasSelects = document.querySelectorAll('.commune-select');

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

  // Conservar la primera opción existente
  const firstOption = select.options[0];

  // Eliminar todas las opciones excepto la primera
  while (select.options.length > 1) {
    select.remove(1);
  }

  // Volver a agregar la primera opción si está definida
  if (firstOption) {
    select.add(firstOption);
  }
};

// Función para cargar opciones de select desde una URL
const cargarOpcionesDesdeURL = (url, select, transform) => {
  const script = document.createElement('script');
  script.src = `${url}?callback=handleResponse`;

  window.handleResponse = data => {
    setSelectDisabled(select, false);
    data.forEach(item => {
      const option = transform(item);
      select.add(option);
    });
  };

  script.onerror = error => {
    console.error(`Error al cargar opciones desde ${url}:`, error);
    setSelectDisabled(select, true);
  };

  document.body.appendChild(script);
};

regionesSelects.forEach(regionesSelect => {
  // Agregar observador de intersección
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // El select es visible, cargar las regiones
        cargarOpcionesDesdeURL(
          'https://apis.digital.gob.cl/dpa/regiones',
          regionesSelect,
          region => crearOption(region.codigo, region.nombre)
        );
        // Dejar de observar el select
        observer.unobserve(regionesSelect);
      }
    });
  });
  observer.observe(regionesSelect);

  // Agregar evento para cargar comunas al seleccionar una región
  let comunasSelect = regionesSelect.parentNode.querySelector('.commune-select');
  if(!comunasSelect) {
    comunasSelect = document.getElementById('commune');
  }

  regionesSelect.addEventListener('change', () => {
    const regionId = regionesSelect.selectedOptions[0].getAttribute('code');
    if (!regionId) {
      setSelectDisabled(comunasSelect, true);
      return;
    }
    const url = `https://apis.digital.gob.cl/dpa/regiones/${regionId}/comunas`;
    cargarOpcionesDesdeURL(
      url,
      comunasSelect,
      comuna => crearOption(comuna.codigo, comuna.nombre)
    );
    setSelectDisabled(comunasSelect, true);
  });

  // Deshabilitar select al inicio
  setSelectDisabled(regionesSelect, true);
});

comunasSelects.forEach(comunasSelect => {
  // Deshabilitar select al inicio
  setSelectDisabled(comunasSelect, true);
});
