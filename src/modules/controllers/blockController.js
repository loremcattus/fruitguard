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
        console.log(focus.Blocks[i].BlockRegistration.dataValues);
        let blockRegistrationId = focus.Blocks[i].BlockRegistration.dataValues.id;
        data[i] = { streets, blockRegistrationId };
      }
    };
    data.reverse();

    return res.render('index.html', { formattedBlocks: data, fileHTML, title });
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

  try {
    // const block = await BlockRegistration.findByPk(req.params.BlockId, {
    //   attributes: ['id', 'createdAt', 'updatedAt'],
    //   include: {
    //     model: Block,
    //     attributes: ['streets']
    //   }
    // })
    const blockRegistration = await BlockRegistration.findByPk(req.params.BlockId, {
      attributes: ['id', 'BlockId', 'createdAt', 'updatedAt']
    })
    const blockStreets = await Block.findByPk(blockRegistration.dataValues.BlockId, {
      attributes: ['streets']
    });
    
    const block = {
      id: blockRegistration.dataValues.id,
      streets: blockStreets.dataValues.streets,
      createdAt: blockRegistration.dataValues.createdAt,
      updatedAt: blockRegistration.dataValues.updatedAt,
    }
    // attributes: ['id'] //'createdAt', 'updatedAt'// FALTA
    // console.log(block.dataValues.BlockId);

    if (block) {
      const { createdAt, updatedAt, ...data } = block;// createdAt, updatedAt,
      data.createdAt = formatDate(createdAt);
      data.updatedAt = formatDate(updatedAt);
      return res.render('index.html', { formattedBlock: data, fileHTML, title, single });
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

    // Añade el bloque al enfoque si fue creado Y Verifica si el enfoque ya tiene el bloque asociado
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


// Editar foco 

export const updateBlock = async (req, res) => {
  try{
      // Validar que vengan datos en el cuerpo 
      if(Object.keys(req.body).length === 0 ){
          return res.status(400).json('El cuerpo de la solicitud está vacío.');
      }
      // Validar el cuerpo de la solicitud 
      const validatedFields = await validateFieldsDataType(req.body, Block);
      // Comprobar errores de validación
      if (validatedFields.errors){
          return res.status(400).json(validatedFields.errors);
      } 
      console.log( req.body);
      let block = await Block.update(req.body,{
          where:{
              id: req.params.BlockId
          }
      });

      console.log( block );

      return res.status(200).json(block);
  } catch (error) {
      console.error('Error al actualizar la manzana',error);
      return res.status(500).json({ error: 'Ocurrió un error en el servidor' });
  }
}
