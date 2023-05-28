import models from '../models/index.js';
import { areas, states } from '../../helpers/enums.js';
import { Sequelize } from 'sequelize';
//import { validateRequestBody } from '../../helpers/validators.js';

const { HouseRegistration, BlockRegistration, House } = models;

// Función para determinar si el dato recibido es una ID de tipo número
const isNumericId = (data) => {
  return !isNaN(parseFloat(data)) && isFinite(data);
};

// Función para determinar si el dato recibido es una dirección de tipo cadena
const isStringAddress = (data) => {
  return typeof data === 'string';
};

export const getHouseRegistrations = async (req, res) => {
  try {
  const fileHTML = 'list-houseRegistration';
  const title = 'Registro de Casas';
  let blockRegistration;
  let searchOptions = {};
  const BlockRegistrationId = parseInt(req.params.BlockRegistrationId, 10);
  try {
    const { idOrAddress, grid, area, state } = req.query;

    // console.log(req.query);

    if (isNumericId(idOrAddress)) {

      // Realizar la consulta utilizando la ID
      console.log("Buscando id");
      blockRegistration = await BlockRegistration.findOne({
        order: [['id', 'DESC']],
        attributes: ['id'],
        include: {
          model: House
        },
        where: { id: BlockRegistrationId },
      }); 
      const id = idOrAddress;
      searchOptions = {
        ...(id && { id }),
        ...(grid && { grid }),
        ...(area && { area }),
        ...(state && { state })
      };
    } else if (isStringAddress(idOrAddress)) {
      console.log(idOrAddress);
      let address ={ [Sequelize.Op.substring]: idOrAddress };
      // Realizar la consulta utilizando la dirección
      blockRegistration = await BlockRegistration.findOne({
        order: [['id', 'DESC']],
        attributes: ['id'],
        include: {
          model: House,
          where: {address: address},
        },
        where: { id: BlockRegistrationId },
      });
      console.log(blockRegistration);
      searchOptions = {
        ...(grid && { grid }),
        ...(area && { area }),
        ...(state && { state })
      };
    } else {

      blockRegistration = await BlockRegistration.findOne({
        order: [['id', 'DESC']],
        attributes: ['id'],
        include: {
          model: House,
        },
        where: { id: BlockRegistrationId },
      });
      searchOptions = {
        ...(grid && { grid }),
        ...(area && { area }),
        ...(state && { state })
      };

    }
  } catch (error) {
    console.log(error);
    return res.render('error.html', { error: 500 });
  }

  let i = 0;
  const formatedHouseRegistrations = []
  blockRegistration.Houses.filter(house => {
    const address = house.dataValues.address;
    const id = house.HouseRegistration.id;
    const { grid, area, state } = house.HouseRegistration;
    const params = { address, grid, area, state, id };
    // Verificar si al menos una opción de búsqueda está presente
    if (Object.keys(searchOptions).length > 0) {
      // Verificar cada criterio de búsqueda si está presente y coincide con el valor correspondiente
      if (
        (!searchOptions.grid || grid == searchOptions.grid) &&
        (!searchOptions.area || area === searchOptions.area) &&
        (!searchOptions.state || state === searchOptions.state) &&
        (!searchOptions.id || id == searchOptions.id) 
      ) {
        formatedHouseRegistrations[i] = params;
        i++;
        return true;
      };
    } else {
      formatedHouseRegistrations[i] = params;
      i++;
      // Si no hay opciones de búsqueda, devolver todas las casas sin filtrar
      return true;
    }
  });
   return res.render('index.html', { formattedHouseRegistration: formatedHouseRegistrations, fileHTML, title, areas, states });

  } catch (error){
    console.log(error);
    return res.render('error.html', { error: 404 });
  }
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
  // //   console.log(error);
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
