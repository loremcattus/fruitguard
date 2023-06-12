import models from '../models/index.js';

const { Prospectus, TreeSpeciesRegistration, TreeSpecies, User } = models;

export const getProspects = async (req, res) => {
  const fileHTML = 'list-prospects';
  const title = 'Listar prospectos';
  let formattedProspectus = '';

  try {
    let { prospectusId } = req.query; // Obtener los parámetros de búsqueda de la URL
    prospectusId = parseInt(prospectusId);
    
    if (prospectusId) {
      const prospectusData = await Prospectus.findByPk(prospectusId, {
        attributes: ['id', 'analyst', 'has_fly', 'treeSpeciesRegistrationId']
      });
      if(prospectusData){

        const prospectus = prospectusData.dataValues
        const { id } = prospectus;

        const { TreeSpecyId } = (await TreeSpeciesRegistration.findByPk(prospectus.treeSpeciesRegistrationId, { attributes: ['TreeSpecyId'] })).dataValues;
        const { species } = (await TreeSpecies.findByPk(TreeSpecyId, { attributes: ['species'] })).dataValues;

        let analyst = !!prospectus.analyst;
        if (analyst) {
          const { name } = (await User.findByPk(prospectus.analyst, { attributes: ['name'], paranoid: false })).dataValues;
          analyst = name;
        }

        const hasFly = !!prospectus.has_fly;

        formattedProspectus = { id, species, analyst, hasFly }

      } else {
        formattedProspectus = `El prospecto <strong>${prospectusId}</strong> no está registrado`;
      }
    } else {
      formattedProspectus = 'Ingresa un id para realizar la búsqueda';
    }

    return res.render('index.html', { formattedProspectus, fileHTML, title });
  } catch (error) {
    console.error(error);
    return res.render('error.html', { error: 500 });
  }
};
