import models from '../models/index.js';
import { validateRequestBody, validateFieldsDataType } from '../../helpers/validators.js';

const { House, Block, force } = models;

const houseProps = [ 'address' ];

export const getHouses = async (__, res) => {
  try{
    const houses = await House.findAll({
			attributes: houseProps, 
      include: [
				{
					model: Block,
					as: "Block",
					attributes: [ 'id', 'streets' ]
				}]
    });

		if (!houses[0]) throw new Error('No hay casas registradas');

		return res.status(200).json(houses);
  } catch (error) {
		return res.status(404).send({ error: error.message });
  }
};


export const addHouses = async (req, res) => {
    try {
      // Valida que vengan datos en el cuerpo
      if (Object.keys(req.body).length === 0) {
        return res.status(400).json({ error: 'El cuerpo de la solicitud está vacío.' });
      }
  
      // Filtrar y validar el cuerpo de la solicitud
      const validatedObject = await validateRequestBody(req.body, House);
      // Comprobar errores de validación
      if (validatedObject.error) {
        return res.status(400).json(validatedObject);
      }
  
      // Comprobar si la casa ya existe en la base de datos
  
      // Crear un nuevo usuario en la base de datos y devolverlo como respuesta
      const house = await House.create(validatedObject);
      return res.status(201).json(house.toJSON());
    } catch (error) {
      console.error('Error al insertar casa', error);
      return res.status(500).json({ error: 'Ocurrió un error en el servidor' });
    }
  };
  