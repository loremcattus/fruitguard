import models from '../models/index.js';
import { validateRequestBody } from '../../helpers/validators.js';
import { Sequelize } from 'sequelize';

const { Focus, Block, BlockRegistration } = models;

export const getBlocks = async (req,res) => {
  const fileHTML = 'list-block';
  const title = 'Manzanas';

    try {
      const { streets } = req.query;
      const FocusId = parseInt(req.params.FocusId, 10);

      const searchOptions = {
        ...(streets && {streets: {[Sequelize.Op.substring]: streets}}),
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
      if (focus && "Blocks" in focus){
        for (let i = 0; i < focus.Blocks.length; i++) {
          let streets = focus.Blocks[i].dataValues.streets.split("@");
          let blockRegistrationId = focus.Blocks[i].BlockRegistration.dataValues.id;
          data[i] = {streets, blockRegistrationId};
        }
      };
      data.reverse();

      return res.render('index.html',{ formattedBlocks: data , fileHTML, title });
    } catch (error){
      console.log(error);
      return res.render('error.html', {error: 404});
    }
};
// Agregar una Manzanas
export const addBlock = async (req, res) => {
  try {
    // Valida que vengan datos en el cuerpo
    if (Object.keys(req.body).length === 0 ) {
      return res.status(400).json({ error: 'El cuerpo de la solicitud está vacío.' });
    }

    const { streets } = req.body;
    const FocusId = parseInt(req.params.FocusId,10);

    const object ={
      streets,
      FocusId: FocusId
    }


    // Filtrar y validar el cuerpo de la solicitud
    const validatedObject = await validateRequestBody(object, Block);

    // Comprobar errores de validacion
    if (validatedObject.error) {
      return res.status(400).json(validatedObject);
    }

    const focus = await Focus.findOne({
      attributes: ['id'],
      where: { id: FocusId },
    });
    
    // TODO: Buscar un bloque existente con los mismos valores dentro del enfoque
    // const existingBlock = await focus.getBlocks({
    //   where: validatedObject,
    // });

    // if (existingBlock) {
      // Buscar un bloque existente con los mismos valores o crear uno nuevo si no existe
      const [block, created] = await Block.findOrCreate({
        where: validatedObject,
      });
      
      // Añadir el bloque al enfoque si fue creado
      if (created) {
        await focus.addBlock(block);
      }
    // }

    return res.status(201).json(block.toJSON());
  } catch (error) {
    console.error('Error al insertar usuario', error);
    return res.status(500).json({ error: 'Ocurrió un error en el servidor' });
  }
};