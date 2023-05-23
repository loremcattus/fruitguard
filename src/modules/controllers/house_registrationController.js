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

export const getHouseRegistrations = async (req, res) => {
  const fileHTML = 'list-houseRegistration';
  const title = 'Registro de Casas';
  let houseRegistration = '';
  let formattedHouseRegistration;
  let data = 'No hay casas registradas o que coincidan con tu búsqueda';
  let searchOptions = {};
  try {
  const { idOrAddress, grid, area_id, state_id } = req.query;
  
  console.log(req.query);
  
  if (isNumericId(idOrAddress)) {
  // Realizar la consulta utilizando la ID
  console.log('Es un numero');
  try {
  // Construir el objeto de búsqueda dinámicamente
    searchOptions = {
      ...(idOrAddress &&  { id: idOrAddress } ),
      ...(grid && { grid }),
      ...(area_id && { area_id }),
      ...(state_id && { state_id })
    };
    } catch (error) {
      console.log(error);
      return res.render('error.html', { error: 404 });
    }

  } else if (isStringAddress(idOrAddress)) {
    // Realizar la consulta utilizando la dirección
    console.log('Es una direccion');
    try{
      // Construigridarea_idr el objeto de búsqueda dinámicamente
      searchOptions = {
        //...(idOrAddress &&  { idOrAddress }),
        ...(grid && { grid }),
        ...(area_id && { area_id }),
        ...(state_id && { state_id })
        //...(sampled !== undefined && { sampled })
      };

    
    } catch (error) {
      console.log(error);
      return res.render('error.html', { error: 404 });
    }
  } else {

    // Construigridarea_idr el objeto de búsqueda dinámicamente
    searchOptions = {
      ...(grid && { grid }),
      ...(area_id && { area_id }),
      ...(state_id && { state_id })
      //...(sampled !== undefined && { sampled })
    };
  }
  } catch (error) {
      return res.render('error.html', { error: 500 });
  }

  // Obtener todas las campañas con las propiedades definidas
  houseRegistration = await HouseRegistration.findAll({
    order: [['id', 'DESC']],
    attributes: ['id', 'grid', 'area_id', 'state_id'],
    where: searchOptions
  });

  formattedHouseRegistration = houseRegistration.map((houseRegistration) => {
    const { id, grid, area_id, state_id } = houseRegistration;
    return { id, grid, area_id, state_id };
  });

  data = houseRegistration.length > 0 ? formattedHouseRegistration : 'No hay casas registradas o que coincidan con tu búsqueda';

  return res.render('index.html', { formattedHouseRegistration: data, fileHTML, title, areas, states });

};




// Obtener una campaña en específico
export const getHouseRegistration = async (req, res) => {
  const fileHTML = 'view-HouseRegistration';
  const title = 'Ver Registro de Casa';
  const single = true;

  // try {
  //   // Obtener todas las campañas con las propiedades definidas
  //   const campaign = await Campaign.findByPk( req.params.CampaignId, {
  //     attributes: ['id', 'name', 'region', 'commune', 'open', 'mapId', 'createdAt', 'updatedAt']
  //   });

  //   if (campaign) {
  //     const { createdAt, updatedAt, ...data } = campaign.dataValues;
  //     data.createdAt = formatDate(createdAt);
  //     data.updatedAt = formatDate(updatedAt);
  //     return res.render('index.html', { formattedCampaign: data, fileHTML, title, single });
  //   } else {
  //     return res.render('error.html', { error: 404 });
  //   }

  // } catch (error) {
  //   console.log(error);
  //   return res.render('error.html', { error: 500 });
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
