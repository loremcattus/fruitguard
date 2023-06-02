import models from '../models/index.js';
import { areas, states } from '../../helpers/enums.js';
import { Sequelize } from 'sequelize';
import { validateRequestBody, formatDate } from '../../helpers/validators.js';

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

      let id = ""
      let address = "";
      if (isNumericId(idOrAddress)) {
        id = idOrAddress ;
      } else if (isStringAddress(idOrAddress)) {
        address = { address: { [Sequelize.Op.substring]: idOrAddress } };
      }
      // Realizar la consulta utilizando la dirección
      console.log(BlockRegistrationId);
      blockRegistration = await BlockRegistration.findOne({
        order: [['id', 'DESC']],
        attributes: ['id'],
        include: {
          model: House,
          where: address,
        },
        where: {id: BlockRegistrationId},
      });

      searchOptions = {
        ...(id && { id }),
        ...(grid && { grid }),
        ...(area && { area }),
        ...(state && { state })
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
      //console.log("id houseRegistration " + id);
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

  } catch (error) {
    console.log(error);
    return res.render('error.html', { error: 404 });
  }
};




// Obtener una campaña en específico
export const getHouseRegistration = async (req, res) => {
  const fileHTML = 'view-HouseRegistration';
  const title = 'Ver Registro de Casa';
  const single = true;

  try {
    // Obtener todas las campañas con las propiedades definidas
    const houseRegistration = await HouseRegistration.findByPk( req.params.HouseId, {
      attributes: ['id', 'grid', 'comment', 'area', 'state', 'createdAt', 'updatedAt','HouseId']
    });
    console.log(houseRegistration);

    const houseAddress = await House.findByPk( houseRegistration.dataValues.HouseId, {
      attributes:['address']
    });
    console.log(houseAddress);
    
    const house = {
      id: houseRegistration.dataValues.id,
      grid: houseRegistration.dataValues.grid,
      comment: houseRegistration.dataValues.comment,
      area: houseRegistration.dataValues.area,
      state: houseRegistration.dataValues.state,
      createdAt: houseRegistration.dataValues.createdAt,
      updatedAt: houseRegistration.dataValues.updatedAt,
      address: houseAddress.dataValues.address
    };
    console.log( house );

    if (house) {
      const { createdAt, updatedAt, ...data } = house;
      data.createdAt = formatDate(createdAt);
      data.updatedAt = formatDate(updatedAt);
      return res.render('index.html', { formattedHouseRegistration: data, fileHTML, title, single });
    } else {
      return res.render('error.html', { error: 404 });
    }
  } catch (error) {
    console.log(error);
    return res.render('error.html', { error: 500 });
  }
};

// Agregar una campaña
export const addHouseRegistration = async (req, res) => {
  console.log("-  - - - - - - - -post- - - - - - -  - ");
  try {
    // Valida que vengan datos en el cuerpo
    if (Object.keys(req.body).length === 0) {
      return res.status(400).json({ error: 'El cuerpo de la solicitud está vacío.' });
    }

    //Rescatar address del object
    const addressHouse = req.body.address;

    const BlockRegistrationId = parseInt(req.params.BlockRegistrationId, 10);
    console.log("block registration id "+BlockRegistrationId);
    console.log("address house "+addressHouse);

    const blockRegistration = await BlockRegistration.findOne({
      attributes: ['id'],
      where: { id: BlockRegistrationId },
    });

    // Busca o crea una casa (house) utilizando la dirección
    const [house, created] = await House.findOrCreate({
      where: { address: addressHouse, BlockId: BlockRegistrationId},
    });
    //si la casa existia dame la id de esa casa para crear un house registration con esa id de casa

    // Añade el bloque al enfoque si fue creado Y Verifica si el enfoque ya tiene el bloque asociado
    if (created || !(await blockRegistration.hasHouse(house))) {

      const idHouseRegistration = house.id;
      const grid  = req.body.grid;
      const state = req.body.state;
      const area = req.body.area;
      const comment = req.body.comment;

      console.log(area)
      console.log(typeof area);

      if (grid && state && area) {
        const houseRegistration = await blockRegistration.addHouse(house, {through:{ grid, comment, area, state }});

        let formatedHouseRegistrations = { idHouseRegistration, grid, comment, area, state, BlockRegistrationId, addressHouse }
        // crear formattedHouseRegistration para mandarle los datos que quiero mostrar en el front 
        //luego en front houseregistration.js escribir las variables
        return res.status(201).json(formatedHouseRegistrations);
      } else {
        return res.status(400).json({ error: 'Faltan datos del formulario' });
      }

    } else {
      console.log('La casa ya existe en el blockregistration');
      // Filtrar y validar el cuerpo de la solicitud
      const validatedObject = await validateRequestBody(req.body, HouseRegistration);

      // Comprobar errores de validación
      if (validatedObject.error) {
        console.log(validatedObject.error);
        return res.status(400).json(validatedObject);
      }

      // Crear una nueva campaña en la base de datos y devolverla como respuesta
      const houseRegistration = await HouseRegistration.create(validatedObject);
      return res.status(201).json(houseRegistration.toJSON());

    }

  } catch (error) {
    console.error('Error al insertar una casa', error);
    return res.status(500).json({ error: 'Ocurrió un error en el servidor' });
  }
};
