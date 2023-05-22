import models from '../models/index.js';
import { validateRequestBody, validateFieldsDataType } from '../../helpers/validators.js';

const { BlockRegistration } = models;

export const getBlockRegistration = async (__, res) => {
    try {
      const blockRegistration = await BlockRegistration.findAll({ attributes: blockProp });
      
      if (!blockRegistration[0]) throw new Error('No hay manzanas registradas');
      
      return res.status(200).json(blockRegistration);
    } catch (error) {
      return res.status(404).send({ error: error.massage });
    }
};

export const addBlockRegistration = async (req, res) => {
  try {
    if (Object.keys(req.body).length === 0) {
      return res.status(400).json({ error: 'El cuerpo de la solicitud está vacío.' });
    }

    const validatedObject = await validateRequestBody(req.body, BlockRegistration);

    if (validatedObject.error) {
      return res.status(400).json(validatedObject);
    }

    // Comprobar si la manzana existe

    const user = await BlockRegistration.create(validatedObject);
    return res.status(201).json(user.toJSON());
  } catch (error) {
    console.error('Error al insertar usuario', error);
    return res.status(500).json({ error: 'Ocurrió un error en el servidor' });
  }
};