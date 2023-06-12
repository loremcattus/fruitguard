import models from '../models/index.js';
import { validateRequestBody, formatDate, validateFieldsDataType } from '../../helpers/validators.js';
import { roles } from '../../helpers/enums.js';

const { Car } = models;

export const getAdminCars = async (req, res) => {
  const fileHTML = 'admin-list-cars';
  const title = 'Administrar Autos';

  try {
    const { patent, capacity, available = true } = req.query; // Obtener los parámetros de búsqueda de la URL

    // Convertir el valor de openString a booleano
    const availableBoolean = available === true;

    // Construir el objeto de búsqueda dinámicamente
    const searchOptions = {
      ...(patent && { patent }),
      ...(capacity && { capacity }),
      available: availableBoolean,
    };

    // Obtener todas las campañas con las propiedades definidas
    const cars = await Car.findAll({
      order: [['id', 'DESC']],
      where: searchOptions
    });

    const data = cars.length > 0 ? cars : 'No hay autos registrados o que coincidan con tu búsqueda';

    const formattedData = formattedCars(data);

    return res.render('index.html', { formattedData, fileHTML, title });
  } catch (error) {
    return res.render('error.html', { error: 500 });
  }

  return res.render('not-logged.html', { fileHTML, title });
}

// Agregar Auto
export const addCar = async (req, res) => {
  try {
    console.log(req.body.patent);
    console.log(req.body.capacity);
    // Valida que vengan datos en el cuerpo
    if (Object.keys(req.body).length === 0) {
      return res.status(400).json({ error: 'El cuerpo de la solicitud está vacío.' });
    }

    const { capacity, patent } = req.body;
    const capacityToInt = parseInt(capacity);

    const carData = {capacity: capacityToInt, patent};
    // Filtrar y validar el cuerpo de la solicitud
    const validatedObject = await validateFieldsDataType(carData, Car);
    // Comprobar errores de validación
    if (!validatedObject.success) {
      return res.status(400).json(validatedObject.error);
    }
    // Crear en la base de datos y devolverla como respuesta
    const car = await Car.create(carData);
    return res.status(201).json(car.toJSON());
  } catch (error) {
    console.error('Error al insertar una campaña', error);
    return res.status(500).json({ error: 'Ocurrió un error en el servidor' });
  }
};


// Obtener una auto en específico
export const getCar = async (req, res) => {
  const fileHTML = 'admin-view-car';
  const title = 'Ver Auto';
  const single = true;

  try {

    const car = await Car.findByPk(req.params.CarId, {
      attributes: ['id', 'patent', 'capacity', 'available', 'TeamId']
    });

    if (car) {
      const { ...formattedCar } = car.dataValues;

      return res.render('index.html', { formattedCar, fileHTML, title, single });
    } else {
      return res.render('error.html', { error: 404 });
    }

  } catch (error) {
    console.error(error);
    return res.render('error.html', { error: 500 });
  }
};


// Editar auto
export const updateCar = async (req, res) => {
  try {
    // Valida que vengan datos en el cuerpo
    if (Object.keys(req.body).length === 0) {
      return res.status(400).json('El cuerpo de la solicitud está vacío.');
    }

    const { capacity, patent, available } = req.body;
    const capacityToInt = parseInt(capacity);

    const carData = {capacity: capacityToInt, patent, available};

    await Car.update(carData, {
      where: {
        id: req.params.CarId
      }
    });

    return res.sendStatus(200);
  } catch (error) {
    console.error('Error al actualizar auto', error);
    return res.status(500).json({ error: 'Ocurrió un error en el servidor' });
  }
}

function formattedCars(data) {
  return data.map((car) => ({
    id: car.dataValues.id,
    patent: car.dataValues.patent,
    capacity: car.dataValues.capacity,
    available: car.dataValues.available,
  }));
}

