import models from '../models/index.js';
import { validateRequestBody } from '../../helpers/validators.js';
import { Sequelize } from 'sequelize';

const { Focus, Block, BlockRegistration } = models;

export const getBlocks = async (req,res) => {
  const fileHTML = 'search-block';
  const title = 'Manzanas';

    try {
      const { streets } = req.query;
      const FocusId = parseInt(req.params.FocusId,10);

      const searchOptions = {
        ...(streets && {streets: {[Sequelize.Op.substring]: streets}}),
      }
      // Obtener todas las Manzanas que han sido registradas en el Foco
      const blocks = await Block.findAll({
        order: [['id', 'DESC']],
        attributes: ['id'],
        include: [
          {
            model: Focus,
            where: { id: FocusId },
            required: false
          },
        ],
        where: searchOptions,
      });
      // Obtener una lista de IDs
      const blockIds = blocks.map(block => block.id);
      // console.log(blockIds);

      const blockRegistrations = await BlockRegistration.findAll({
        order: [['id', 'DESC']],
        where: {
          BlockId: {
            [Sequelize.Op.in]: blockIds
          }
        }
      });

      console.log(blockRegistrations);

      // const { streets } = req.query;
      // const FocusId = parseInt(req.params.FocusId, 10);

      // const blockRegistrations = await BlockRegistration.findAll({
      //   order: [['id', 'DESC']],
      //   include: [
      //     {
      //       model: Block,
      //       attributes: ['id'],
      //       include: [
      //         {
      //           model: Focus,
      //           where: { id: FocusId, active: true },
      //           required: false
      //         }
      //       ],
      //       where: streets ? { streets: { [Sequelize.Op.substring]: streets } } : {}
      //     }
      //   ]
      // });

      // console.log(blockRegistrations);



      // console.log(blockRegistrations);
      
      // console.log(blockRegistrations);

      // const data = blockRegistrations.length > 0 ? blockRegistrations : 'No hay focos registrados o que coincidan con tu búsqueda';
      
      // return res.render('index.html',{ formattedBlocks: data , fileHTML, title });
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
      FocuId: FocusId
    }


    // Filtrar y validar el cuerpo de la solicitud
    const validatedObject = await validateRequestBody(object, Block, BlockRegistration);

    console.log(validatedObject);

    // Comprobar errores de validacion
    if (validatedObject.error) {
      return res.status(400).json(validatedObject);
    }

    // Crear un nuevo foco en la BBDD y vpñverña como respuesta 
    const block = await Block.create(validatedObject);
    return res.status(201).json(block.toJSON());
  } catch (error) {
    console.error('Error al insertar usuario', error);
    return res.status(500).json({ error: 'Ocurrió un error en el servidor' });
  }
};