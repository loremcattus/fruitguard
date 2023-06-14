import { formatDate } from '../../helpers/validators.js';
import models from '../models/index.js';
import { roles } from '../../helpers/enums.js';

const { Prospectus, TreeSpeciesRegistration, TreeSpecies, User, HouseRegistration, House, BlockRegistration, Focus } = models;

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
      if (prospectusData) {

        const prospectus = prospectusData.dataValues;
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


export const getProspectus = async (req, res) => {
  const fileHTML = 'view-prospectus';
  const title = 'Ver prospecto';
  const single = true;

  try {
    let { ProspectusId } = req.params; // Obtener los parámetros de búsqueda de la URL
    ProspectusId = parseInt(ProspectusId);

    const prospectus = (await Prospectus.findByPk(ProspectusId)).dataValues;

    const { TreeSpecyId } = (await TreeSpeciesRegistration.findByPk(prospectus.treeSpeciesRegistrationId, { attributes: ['TreeSpecyId'] })).dataValues;
    const { species } = (await TreeSpecies.findByPk(TreeSpecyId, { attributes: ['species'] })).dataValues;

    let { id, number_of_samples, units_per_sample, has_fly, analyst, weight, updatedAt } = prospectus;

    const numberOfSamples = number_of_samples;
    const unitsPerSample = units_per_sample;

    const hasFly = !!has_fly;

    analyst = !!analyst;
    if (analyst) {
      const { name } = (await User.findByPk(prospectus.analyst, { attributes: ['name'], paranoid: false })).dataValues;
      analyst = name;
    }

    weight = weight ? weight : false;

    updatedAt = formatDate(updatedAt);

    const formattedProspectus = { id, species, numberOfSamples, unitsPerSample, hasFly, analyst, weight, updatedAt };

    return res.render('index.html', { formattedProspectus, fileHTML, title, single });
  } catch (error) {
    console.error('Error al ver detalle del prospecto : ', error);
    return res.redirect('/prospects');
  }
};

export const updateProspectus = async (req, res) => {
  const id = parseInt(req.params.ProspectusId);
  try {
    let { weight, hasFly } = req.body;

    // const user = await User.findByPk({
    //   attributes: ['role'],
    //   where: {
    //     id: req.user.id
    //   }
    // });

    // if (user.dataValues.role != roles.ANALYST) return res.sen;

    const analyst = req.user.id;

    

    weight = weight ? parseInt(weight) : false;

    let updatedOptions = {
      ...( weight && { weight } ),
      ...( hasFly != null && { has_fly: hasFly} ),
    }

    if (Object.keys(updatedOptions).length) {
      updatedOptions.analyst = analyst; 
    }

    const wasUpdated = await Prospectus.update(updatedOptions, {
      where: { id }
    });

    if(!wasUpdated) return res.sendStatus(404);

    if(wasUpdated && ('has_fly' in updatedOptions)) {
      const { treeSpeciesRegistrationId } = (await Prospectus.findByPk(id, {
        attributes: ['treeSpeciesRegistrationId']
      })).dataValues;
      const { HouseRegistrationId } = (await TreeSpeciesRegistration.findByPk(treeSpeciesRegistrationId, {
        attributes: ['HouseRegistrationId'],
      })).dataValues;
      const { HouseId, BlockRegistrationId } = (await HouseRegistration.findByPk(HouseRegistrationId, {
        attributes: ['HouseId', 'BlockRegistrationId'],
      })).dataValues;
      const { address } = (await House.findByPk(HouseId, {
        attributes: ['address'],
      })).dataValues;
      const { FocuId } = (await BlockRegistration.findByPk(BlockRegistrationId, {
        attributes: ['FocuId'],
      })).dataValues;
      const { CampaignId } = (await Focus.findByPk(FocuId, {
        attributes: ['CampaignId'],
      })).dataValues;

      if (updatedOptions.has_fly) {
        const [focus, created] = await Focus.findOrCreate({ where: { CampaignId, address }});
        if (!created) focus.update({active: true});
      } else {
        await Focus.update({active: false}, {
          where: { CampaignId, address }
        });
      }
    }

    return res.sendStatus(200);
  } catch (error) {
    console.error('Error al actualizar prospecto : ', error);
    return res.sendStatus(500);
  }
}
