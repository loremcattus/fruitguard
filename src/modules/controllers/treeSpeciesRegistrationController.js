import models from '../models/index.js';
import { treeStates } from '../../helpers/enums.js';
import { Sequelize } from 'sequelize';
import { validateRequestBody } from '../../helpers/validators.js';
import treeSpeciesRegistrationModel from '../models/treeSpeciesRegistration.js';

const { HouseRegistration, TreeSpecies, TreeSpeciesRegistration } = models;

export const getTreeSpeciesRegistrations = async (req, res) => {
  const breadcrumbs = {
    CampaignId: req.params.CampaignId,
    FocusId: req.params.FocusId,
    BlockRegistrationId: req.params.BlockRegistrationId,
    HouseRegistrationId: req.params.HouseRegistrationId,
  };

  const fileHTML = 'list-treeSpeciesRegistration';
  const title = 'Registro de Árboles';
  try {
    const treeSpecies = await TreeSpecies.findAll({
      attributes: ['id','species'],
      distinct: true,
    });
    const formattedTreeSpecies = treeSpecies.map(species => ({
      id: species.id,
      species: species.species
    }));
    
    let searchOptions = {};
    const houseRegistrationId = parseInt(req.params.HouseRegistrationId, 10);
    const { species, treeState } = req.query;
    const speciesId = species ? { id: parseInt(species, 10)} : '';
    searchOptions = {
      ...(species && { species }),
      ...(treeState && { treeState })
    }
    // Trae todas las casas filtradas por especie siempre y cuando venga en la url
    const houseRegistration = await HouseRegistration.findByPk( houseRegistrationId, {
      order: [['id', 'DESC']],
      attributes: ['id'],
      include: {
        model: TreeSpecies,
        where: speciesId
      }
    });
    // DEBO Buscar el Id de el registro de árbol 
    // para enlazarlo a la vista del árbol

    const formatedTreeSpeciesRegistration = [];
    if(houseRegistration) {
      if (speciesId) {
        const species = houseRegistration.TreeSpecies[0].dataValues.species;
        for(let i = 0; i < houseRegistration.TreeSpecies.length; i++) {
          const tree_state = houseRegistration.TreeSpecies[i].dataValues.TreeSpeciesRegistration.dataValues.tree_state;
          if (searchOptions.treeState && tree_state != searchOptions.treeState ){
            continue;
          }
          const params = { tree_state, species };
          formatedTreeSpeciesRegistration.push(params);
        }
      } else {
        for(let i = 0; i < houseRegistration.TreeSpecies.length; i++) {
          const species = houseRegistration.TreeSpecies[i].dataValues.species;
          const tree_state = houseRegistration.TreeSpecies[i].dataValues.TreeSpeciesRegistration.dataValues.tree_state;
          if (searchOptions.treeState && tree_state != searchOptions.treeState ){
            continue;
          }
          const params = { tree_state, species };
          formatedTreeSpeciesRegistration.push(params);
        }
      }
    }
    
    return res.render('index.html', { formatedTreeSpeciesRegistration, fileHTML, title, breadcrumbs, treeStates, formattedTreeSpecies, houseRegistrationId  });
  } catch (error) {
    console.log(error);
    return res.render('error.html', { error: 404 });
  }

}

export const addTreeSpeciesRegistration = async (req, res) => {
  console.log(" - - - - - - - - post - - - - - - - -")
  try {
    // Valida que vengan datos en el cuerpo
    if (Object.keys(req.body).length === 0) {
      return res.status(400).json({ error: 'El cuerpo de la solicitud está vacío.' });
    }

    //Rescatar  del object
    const speciesTree = req.body.species;

    const TreeSpeciesRegistrationId = parseInt(req.param.TreeSpeciesRegistrationId, 10);
    console.log(TreeSpeciesRegistrationId);
    
    const treeSpeciesRegistration = await TreeSpeciesRegistration.findOne({
      attributes: ['id'],
      where: { id: TreeSpeciesRegistrationId },
    });

    const [treeSpecies, created] = await TreeSpecies.findOrCreate({
      where: { species: speciesTree },
    });

    if (created || !(await treeSpeciesRegistration.hasTreeSpecies(treeSpecies))) {

      const idHouseRegistration = treeSpecies.id;
      const grid  = req.body.grid;
      const state = req.body.state;
      const area = req.body.area;
      const comment = req.body.comment;

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
}

