import models from '../models/index.js';
import { validateRequestBody } from '../../helpers/validators.js';
import { Sequelize } from 'sequelize';

const { BlockRegistration, Block } = models;

export const getBlocks = async (req,res) => {
  const fileHTML = 'search-block';
  const title = 'Manzanas';

    try {
      const{ streets } = req.query;

      const FocusId = parseInt(req.params.FocusId,10);

      const searchOptions = {
        ...(streets && {streets: {[Sequelize.Op.substring]: streets}}),
        FocuId: FocusId
      }
      // Obtener todas las Manzanas con las propiedades
      const blockRegistrations = await BlockRegistration.findAll({
        order: [['id','DESC']],
        where: searchOptions,
      });
      
      console.log(blockRegistrations);

      const data = blockRegistrations.length > 0 ? blockRegistrations : 'No hay focos registrados o que coincidan con tu búsqueda';
      
      return res.render('index.html',{ formattedBlocks: data , fileHTML, title });
    } catch (error){
      console.log(error);
      return res.render('error.html', {error: 404});
    }
};

// Agregar una Manzana 
export const addBlock = async (req, res) => {
  try {

    // Valida que vengan datos en el cuerpo
    if (Object.keys(req.body).length === 0 ) {
      return res.status(400).json({ error: 'El cuerpo de la solicitud está vacío.' });
    }

    const { streets } = req.body;
    
    const CampaignId = parseInt(req.params.CampaignId, 10);
    const FocusId = parseInt(req.params.FocusId,10);

    const object ={
      streets,
      CampaignId,
      FocusId
    }


    // Filtrar y validar el cuerpo de la solicitud
    const validatedObject = await validateRequestBody(object, Block);

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