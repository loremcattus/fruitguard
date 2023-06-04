import models from '../models/index.js';
import { validateRequestBody, validateFieldsDataType, formatDate } from '../../helpers/validators.js';
import { Sequelize } from 'sequelize';

const { Focus, Block, BlockRegistration } = models;

export const getBlocks = async (req, res) => {
  const fileHTML = 'list-block';
  const title = 'Manzanas';

  try {

    const { streets } = req.query;
    const FocusId = parseInt(req.params.FocusId, 10);

    const breadcrumbs = {
      CampaignId: req.params.CampaignId,
      FocusId: req.params.FocusId,
    };

    const searchOptions = {
      ...(streets && { streets: { [Sequelize.Op.substring]: streets } }),
    }

    // Obtener todas las Manzanas que han sido registradas en el Foco
    const focus = await Focus.findOne({
      attributes: ['id'],
      include:
      {
        model: Block,
        where: searchOptions,
      },
      where: { id: FocusId },
    });

    const data = [];
    if (focus && "Blocks" in focus) {
      for (let i = 0; i < focus.Blocks.length; i++) {
        let streets = focus.Blocks[i].dataValues.streets.split("@");
        let blockRegistrationId = focus.Blocks[i].BlockRegistration.dataValues.id;
        data[i] = { streets, blockRegistrationId };
      }
    };
    data.reverse();

    return res.render('index.html', { formattedBlocks: data, fileHTML, title, breadcrumbs });
  } catch (error) {
    console.log(error);
    return res.render('error.html', { error: 404 });
  }
};

// Obtener una manzana en especifico 
export const getBlock = async (req, res) => {
  const fileHTML = 'view-block';
  const title = 'Ver Manzana';
  const single = true;

  const breadcrumbs = {
    CampaignId: req.params.CampaignId,
    FocusId: req.params.FocusId,
  };

  try {

    const blockRegistration = await BlockRegistration.findByPk(req.params.BlockId, {
      attributes: ['id', 'BlockId', 'createdAt']
    })
    const blockStreets = await Block.findByPk(blockRegistration.dataValues.BlockId, {
      attributes: ['streets', 'updatedAt']
    });

    const block = {
      id: blockRegistration.dataValues.id,
      streets: blockStreets.dataValues.streets,
      createdAt: blockRegistration.dataValues.createdAt,
      updatedAt: blockStreets.dataValues.updatedAt,
    }

    if (block) {
      const { createdAt, updatedAt, ...data } = block;// createdAt, updatedAt,
      data.createdAt = formatDate(createdAt);
      data.updatedAt = formatDate(updatedAt);
      return res.render('index.html', { formattedBlock: data, fileHTML, title, single, breadcrumbs });
    } else {
      return res.render('error.html', { error: 404 });
    }
  } catch (error) {
    console.log(error);
    return res.render('error.html', { error: 500 });
  }
};

// Agregar una Manzanas
export const addBlock = async (req, res) => {
  try {
    // Valida que vengan datos en el cuerpo
    if (Object.keys(req.body).length === 0) {
      return res.status(400).json({ error: 'El cuerpo de la solicitud está vacío.' });
    }

    // Obtiene los datos necesarios del cuerpo de la solicitud y del parámetro FocusId
    const { streets } = req.body;
    const FocusId = parseInt(req.params.FocusId, 10);

    // Crea un objeto con los datos obtenidos
    const object = {
      streets,
      FocusId: FocusId
    }

    // Filtrar y validar el cuerpo de la solicitud utilizando una función externa llamada "validateRequestBody"
    const validatedObject = await validateRequestBody(object, Block);

    // Comprobar errores de validación
    if (validatedObject.error) {
      return res.status(400).json(validatedObject);
    }

    // Busca un enfoque (focus) utilizando el FocusId proporcionado
    const focus = await Focus.findOne({
      attributes: ['id'],
      where: { id: FocusId },
    });

    // Busca o crea un bloque (block) utilizando el objeto validado
    const [block, created] = await Block.findOrCreate({
      where: validatedObject,
    });

    // Añade el bloque al foco si fue creado Y Verifica si el foco ya tiene el bloque asociado
    if (created || !(await focus.hasBlock(block))) {
      await focus.addBlock(block);
    } else {
      return res.status(409).json('La manzana ya existe en el foco');
    }

    // Retorna el bloque como una respuesta JSON con estado 201 (creado)
    return res.status(201).json(block.toJSON());
  } catch (error) {
    console.error('Error al insertar usuario', error);
    return res.status(500).json({ error: 'Ocurrió un error en el servidor' });
  }
};


// Editar block 

export const updateBlock = async (req, res) => {
  try {
    // Validar que vengan datos en el cuerpo 
    if (Object.keys(req.body).length === 0) {
      return res.status(400).json('El cuerpo de la solicitud está vacío.');
    }
    // Validar el cuerpo de la solicitud 
    const validatedFields = await validateFieldsDataType(req.body, Block);
    // Comprobar errores de validación
    if (validatedFields.errors) {
      return res.status(400).json(validatedFields.errors);
    }
    // TODO: No se debe actualizar el bloque,
    // se debe verificar si el bloque ha sido registrado en otro foco,
    // de no ser así, se debe borrar.
    // Luego se debe borrar la relación entre foco y bloque
    // y crear una nueva relación entre foco y el nuevo bloque
    const block = await Block.update(req.body, {
      where: {
        id: req.params.BlockId
      }
    });

    return res.status(200).json(block);
  } catch (error) {
    console.error('Error al actualizar la manzana', error);
    return res.status(500).json({ error: 'Ocurrió un error en el servidor' });
  }
}
