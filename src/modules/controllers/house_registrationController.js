import models from '../models/index.js';
import { areas, states } from '../../helpers/enums.js';
//import { validateRequestBody } from '../../helpers/validators.js';

const { HouseRegistration } = models;

// Función para determinar si el dato recibido es una ID de tipo número
const isNumericId = (data) => {
  return !isNaN(parseFloat(data)) && isFinite(data);
};

// Función para determinar si el dato recibido es una dirección de tipo cadena
const isStringAddress = (data) => {
  return typeof data === 'string';
};

export const getHouseRegistration = async (req, res) => {
  const fileHTML = 'search-houseRegistration';
  const title = 'Registro de Casas';
  let houseRegistration;
  let formattedHouseRegistration;
  let data = 'No hay casas registradas o que coincidan con tu búsqueda';

  const { idOrAddress, grid, area, state } = req.query;
  
  console.log('req.query');
  
  if (isNumericId(idOrAddress)) {
  // Realizar la consulta utilizando la ID
  console.log('Es un numero');
  try {
  // Construir el objeto de búsqueda dinámicamente
    const searchOptions = {
      ...(idOrAddress &&  { id }),
      ...(grid && { grid }),
      ...(area && { area }),
      ...(state && { state })
    };
    // Obtener todas las campañas con las propiedades definidas
    houseRegistration = await HouseRegistration.findAll({
      order: [['id', 'DESC']],
      attributes: ['id', 'address', 'grid', 'area', 'state'],
      where: searchOptions
    });

    formattedHouseRegistration = houseRegistration.map((houseRegistration) => {
      const { id, address, grid, area, state } = houseRegistration;
      return { id, address, grid, area, state };
    });
  
    const data = houseRegistration.length > 0 ? formattedHouseRegistration : 'No hay casas registradas o que coincidan con tu búsqueda';
  
    //return res.render('index.html', { formattedHouseRegistration: data, fileHTML, title });

    } catch (error) {
      return res.render('error.html', { error: 404 });
    }

  } else if (isStringAddress(idOrAddress)) {
    // Realizar la consulta utilizando la dirección
    console.log('Es una direccion');
    try{
      // Construir el objeto de búsqueda dinámicamente
      const searchOptions = {
        ...(idOrAddress &&  { address }),
        ...(grid && { grid }),
        ...(area && { area }),
        ...(state && { state })
      };
      // Obtener todas las campañas con las propiedades definidas
      houseRegistration = await HouseRegistration.findAll({
        order: [['address', 'DESC']],
        attributes: ['id', 'address', 'grid', 'area', 'state'],
        where: searchOptions
      });

      formattedHouseRegistration = houseRegistration.map((houseRegistration) => {
        const { id, address, grid, area, state } = houseRegistration;
        return { id, address, grid, area, state };
      });
    
      const data = houseRegistration.length > 0 ? formattedHouseRegistration : 'No hay casas registradas o que coincidan con tu búsqueda';
    
      //return res.render('index.html', { formattedHouseRegistration: data, fileHTML, title });
    
    } catch (error) {
      return res.render('error.html', { error: 404 });
    }
  } 
  //const data = houseRegistration.length > 0 ? formattedHouseRegistration : 'No hay casas registradas o que coincidan con tu búsqueda';
  return res.render('index.html', { formattedHouseRegistration: data, fileHTML, title, areas, states });
  
  // else {
  //   // Manejar el caso de un dato no válido
  //   return res.status(400).json({ error: 'Dato no válido' });
  // }
  
};

// Agregar una campaña
export const addHouseRegistration = async (req, res) => {
  try {
    // Valida que vengan datos en el cuerpo
    if (Object.keys(req.body).length === 0) {
      return res.status(400).json({ error: 'El cuerpo de la solicitud está vacío.' });
    }

    // Filtrar y validar el cuerpo de la solicitud
    const validatedObject = await validateRequestBody(req.body, HouseRegistration);
    // Comprobar errores de validación
    if (validatedObject.error) {
      return res.status(400).json(validatedObject);
    }

    // Crear una nueva campaña en la base de datos y devolverla como respuesta
    const houseRegistration = await HouseRegistration.create(validatedObject);
    return res.status(201).json(houseRegistration.toJSON());
  } catch (error) {
    console.error('Error al insertar una casa', error);
    return res.status(500).json({ error: 'Ocurrió un error en el servidor' });
  }
};
