import models from '../models/index.js';
import { treeStates } from '../../helpers/enums.js';
import { Sequelize } from 'sequelize';
import { validateRequestBody } from '../../helpers/validators.js';
import treeSpeciesRegistrationModel from '../models/treeSpeciesRegistration.js';

const { HouseRegistration, TreeSpecies, TreeSpeciesRegistration } = models;

export const getTreeSpeciesRegistrations = async (req, res) => {
  try {
    const fileHTML = 'list-treeSpeciesRegistration';
    const title = 'Registro de Árboles';
    let searchOptions = {};
    const houseRegistrationId = parseInt(req.params.HouseRegistrationId, 10);
    console.log(houseRegistrationId)
    //const TreeSpeciesId;
    const { species, treeState } = req.query;

    const houseRegistration = await HouseRegistration.findOne({
      order: [['id', 'DESC']],
      attributes: ['id'],
      include: {
        model: TreeSpecies,
        where: treeState,
      },
      where: {id: houseRegistrationId},
    });

    const treeSpecies = await TreeSpecies.findAll({
      attributes: ['id','species'],
      distinct: true,
    });

    const formattedTreeSpecies = treeSpecies.map(species => ({
      id: species.id,
      species: species.species
    }));

    searchOptions = {
      ...(species && { species }),
      ...(treeState && { treeState })
    }

    let i = 0;
    const formatedTreeSpeciesRegistration = []
    houseRegistration.TreeSpecies.filter(treeSpecies => {
      const species = treeSpecies.dataValues.species;
      //console.log("id houseRegistration " + id);
      const { tree_state } = treeSpecies.TreeSpeciesRegistration;
      console.log("tree state id " + tree_state)
      const params = { tree_state, species };
      // Verificar si al menos una opción de búsqueda está presente
      if (Object.keys(searchOptions).length > 0) {
        // Verificar cada criterio de búsqueda si está presente y coincide con el valor correspondiente
        if (
          (!searchOptions.species || species == searchOptions.species)// &&
          //(!searchOptions.id || id == searchOptions.id)
        ) {
          formatedTreeSpeciesRegistration[i] = params;
          i++;
          return true;
        };
      } else {
        formatedTreeSpeciesRegistration[i] = params;
        i++;
        // Si no hay opciones de búsqueda, devolver todas las casas sin filtrar
        return true;
      }
    });

    console.log(formattedTreeSpecies);

    return res.render('index.html', { formatedTreeSpeciesRegistration, fileHTML, title, treeStates, formattedTreeSpecies });
  } catch (error) {
    console.log(error);
    return res.render('error.html', { error: 404 });
  }

}