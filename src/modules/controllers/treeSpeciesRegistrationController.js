import models from '../models/index.js';
import { treeStates } from '../../helpers/enums.js';
import { validateRequestBody, validateFieldsDataType } from '../../helpers/validators.js';


const { HouseRegistration, TreeSpecies, TreeSpeciesRegistration, Prospectus } = models;

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
    const { species, treeState, hasFruit } = req.query;
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



    const formatedTreeSpeciesRegistration = [];
    if(houseRegistration) {
      if (speciesId) {
        const species = houseRegistration.TreeSpecies[0].dataValues.species;
        for(let i = 0; i < houseRegistration.TreeSpecies.length; i++) {
          const treeRegistrationId = houseRegistration.TreeSpecies[i].dataValues.TreeSpeciesRegistration.dataValues.id; 
          const tree_state = houseRegistration.TreeSpecies[i].dataValues.TreeSpeciesRegistration.dataValues.tree_state;
          if (searchOptions.treeState && tree_state != searchOptions.treeState ){
            continue;
          }
          if (hasFruit && ![treeStates.RIPE, treeStates.UNRIPE].includes(tree_state)) { continue; }
          const params = { tree_state, species, treeRegistrationId };
          formatedTreeSpeciesRegistration.push(params);
        }
      } else {
        for(let i = 0; i < houseRegistration.TreeSpecies.length; i++) {
          const species = houseRegistration.TreeSpecies[i].dataValues.species;
          const treeRegistrationId = houseRegistration.TreeSpecies[i].dataValues.TreeSpeciesRegistration.dataValues.id; 
          const tree_state = houseRegistration.TreeSpecies[i].dataValues.TreeSpeciesRegistration.dataValues.tree_state;
          if (searchOptions.treeState && tree_state != searchOptions.treeState ){
            continue;
          }
          if (hasFruit && ![treeStates.RIPE, treeStates.UNRIPE].includes(tree_state)) { continue; }
          const params = { tree_state, species, treeRegistrationId };
          formatedTreeSpeciesRegistration.push(params);
        }
      }
    }
    
    return res.render('index.html', { formatedTreeSpeciesRegistration, fileHTML, title, breadcrumbs, treeStates, formattedTreeSpecies, houseRegistrationId });
  } catch (error) {
    console.error(error);
    return res.render('error.html', { error: 404 });
  }
};


/////////////////////////////////////////////////////////// Árbol en especifico  //////////////////////////////////////////////////////////////////////7
export const getTreeRegistration = async(req, res) =>{
  const fileHTML = 'view-treeSpeciesRegistration';
  const title = 'Ver  Detalle del árbol';
  const single = true;

  const breadcrumbs = {
    CampaignId: req.params.CampaignId,
    FocusId: req.params.FocusId,
    BlockRegistrationId: req.params.BlockRegistrationId,
    HouseRegistrationId: req.params.HouseRegistrationId,
  };

  try{
    const treeSpecies = await TreeSpecies.findAll({
      attributes: ['id','species'],
      distinct: true,
    });
    const formattedTreeSpecies = treeSpecies.map(species => ({
      id: species.id,
      species: species.species
    }));
    // Obtener todas las propiedades del treeRegistrations
    const prospectus = await Prospectus.findOne({
      attributes: ['id','units_per_sample','TreeSpeciesRegistrationId'],
      where:{
        treeSpeciesRegistrationId: req.params.TreeSpeciesRegistrationId
      }
    });
    const treeRegistration = await TreeSpeciesRegistration.findByPk(req.params.TreeSpeciesRegistrationId,{
      attributes: ['id','tree_number','tree_state','HouseRegistrationId', 'TreeSpecyId']
    })
    const treeSpecy = await TreeSpecies.findByPk(treeRegistration.dataValues.TreeSpecyId,{
      attributes: ['id','species']
    })

    let prospectusId = 0;
    let units_per_sample = 0;

    if (prospectus){
      prospectusId =  prospectus.dataValues.id;
      units_per_sample = prospectus.dataValues.units_per_sample;
    }

    const tree ={
      idTreeRegist: treeRegistration.dataValues.id,
      // units_per_sample: prospectus.dataValues.units_per_sample,
      tree_state: treeRegistration.dataValues.tree_state,
      tree_number: treeRegistration.dataValues.tree_number,
      species: treeSpecy.dataValues.species,

    }

    if (tree) {
      const { ...data } = tree;
      return res.render('index.html', { formattedTreeRegistration: data, fileHTML, title, single, treeStates, breadcrumbs, formattedTreeSpecies, prospectusId, units_per_sample});
    } else {
      return res.render('error.html', { error: 404 });
    }
  } catch (error) {
    console.error(error);
    return res.render('error.html', { error: 500 });
  }
};

//////////////ADD PROSPECTUS////////////////////////////////////////////////////////////////////////
export const addProspectus = async (req,res)=>{
  try{
    //calida que vengan datos en el cuerpo 
    if(Object.keys(req.body).length === 0 ){
      return res.status(400).json({ error: 'El cuerpo de la solicitud esta vacio'});
    }
    const  units_per_sample  = parseInt(req.body.units_per_sample);
    const treeSpeciesRegistrationId = parseInt(req.params.TreeSpeciesRegistrationId, 10);

    const object = { 
      units_per_sample,
      treeSpeciesRegistrationId
    }

    // Filtrar y validar el cuerpo de la solicitud
    const validatedObject = await validateRequestBody(object, Prospectus);

    // Comprobar objetos de la validacion
    if(validatedObject.error){
      return res.status(400).json(validatedObject);
    }

    // Crear un nuevo prospecto em la BBDD y volverla como respuesta
    const prospectus  = await Prospectus.create(validatedObject);
    
    return res.status(201).json(prospectus.toJSON());
  }catch( error ){
    console.error('Error al insertar un prospecto', error );
    return res.status(500).json({error: 'Ocurrió un error en el servidor'});
  }
};


export const addTreeSpeciesRegistration = async (req, res) => {
  try {

    
    // Valida que vengan datos en el cuerpo
    if (Object.keys(req.body).length == 0) {
      return res.status(400).json({ error: 'El cuerpo de la solicitud está vacío.' });
    }

    //Rescatar  del object
    const speciesTree = req.body.species;

    const houseRegistrationId = parseInt(req.params.HouseRegistrationId, 10);
    
    const houseRegistration = await HouseRegistration.findOne({
      attributes: ['id'],
      where: { id: houseRegistrationId },
    });

    const [treeSpecies, created] = await TreeSpecies.findOrCreate({
      where: { id: speciesTree },
    });

    if (created || !(await houseRegistration.hasTreeSpecies(treeSpecies))) {

      const idTreeSpeciesRegistration = treeSpecies.id;
      const species  = treeSpecies.species;
      const tree_state = req.body.treeState;
      const tree_number = req.body.numberTrees;

      if (species && tree_state && tree_number) {
        await houseRegistration.addTreeSpecies(treeSpecies, {through:{ species, tree_state, tree_number }});
        let formatedTreeSpeciesRegistration = { idTreeSpeciesRegistration, species, tree_state, tree_number, houseRegistrationId }
        return res.status(201).json(formatedTreeSpeciesRegistration);
      } else {
        return res.status(400).json({ error: 'Faltan datos del formulario' });
      }

    } else {
      return res.sendStatus(409);
    }

  } catch (error) {
    console.error('Error al insertar una árbol', error);
    return res.status(500).json({ error: 'Ocurrió un error en el servidor' });
  }
}



// Editar árbol 

export const updateTreeRegistration = async (req, res) => {
  try {
    // Validar que vengan los datos en el cuerpo 
    if(Object.keys(req.body).length === 0){
      return res.status(400).json('El cuerpo de la solicitud está vacío.');
    }
    // Validar el cuerpo de la soli
    const validatedFields = await validateFieldsDataType(req.body, TreeSpeciesRegistration);
    // Comprobar errores de validación 
    if(validatedFields.errors){
      return res.status(400).json(validatedFields.errors);
    }

    const { tree_state, tree_number, species } = req.body;
    
    let TreeSpecyId = 0;
    if (species) {
      TreeSpecyId = await TreeSpecies.findOne({
        where: { species }
      });
      TreeSpecyId = TreeSpecyId.dataValues.id;
    }

    const infoToUpdate = {
      ...(tree_number && { tree_number }),
      ...(tree_state && { tree_state }),
      ...(TreeSpecyId && { TreeSpecyId }),
    };

    // Revisa que no haya sido ingresado previamente en el registro de casa
    const treeSpeciesRegistration = await TreeSpeciesRegistration.findOne({
      attributes: ['id'],
      where: {
        HouseRegistrationId: req.params.HouseRegistrationId,
        TreeSpecyId: TreeSpecyId
      }
    });
    if(treeSpeciesRegistration) return res.sendStatus(409);

    let tree = await TreeSpeciesRegistration.update(infoToUpdate, {
      where:{
        id: req.params.TreeSpeciesRegistrationId
      }
    });

    let { units_per_sample } = req.body;
    units_per_sample = units_per_sample ? parseInt(units_per_sample) : '';
    if ( units_per_sample ) {
      await Prospectus.update({ units_per_sample }, {
        where: {
          treeSpeciesRegistrationId: req.params.TreeSpeciesRegistrationId
        }
      });
    }


    return res.status(200).json(tree);
  } catch(error) {
    console.error('Error al actualizar el árbol ',error);
    return res.status(500).json({error: 'Ocurrió un error en el servidor' });
  }
}