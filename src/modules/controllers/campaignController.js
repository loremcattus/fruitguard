import { promises as fsPromises } from 'fs';
import models from '../models/index.js';
import { validateRequestBody, formatDate, validateFieldsDataType, getPermissionLevel } from '../../helpers/validators.js';
import { roles, states, treeStates } from '../../helpers/enums.js';

const { Campaign, User, UserRegistration, Focus, BlockRegistration, HouseRegistration, TreeSpeciesRegistration, Prospectus, TreeSpecies, Sequelize } = models;

const isNumeric = (str) => {
  return /^\d+$/.test(str);
};

// Obtener todas las campañas
export const getCampaigns = async (req, res) => {
  const fileHTML = 'list-campaigns';
  const title = 'Listar Campañas';

  try {
    const { name, open = true, region, commune } = req.query; // Obtener los parámetros de búsqueda de la URL

    // Convertir el valor de openString a booleano
    const openBoolean = open === true;

    // Construir el objeto de búsqueda dinámicamente
    const searchOptions = {
      ...(name && { name: { [Sequelize.Op.substring]: name } }),
      open: openBoolean,
      ...(region && { region }),
      ...(commune && { commune })
    };

    // Obtener todas las campañas con las propiedades definidas
    const campaigns = await Campaign.findAll({
      order: [['id', 'DESC']],
      attributes: ['id', 'name', 'region', 'commune', 'open'],
      where: searchOptions
    });

    const data = campaigns.length > 0 ? campaigns : 'No hay campañas registradas o que coincidan con tu búsqueda';

    return res.render('index.html', { formattedCampaigns: data, fileHTML, title });
  } catch (error) {
    return res.render('error.html', { error: 500 });
  }
};

// Obtener una campaña en específico
export const getCampaign = async (req, res) => {
  const fileHTML = 'view-campaign';
  const title = 'Ver Campaña';
  const single = true;

  try {
    // Obtener todas las campañas con las propiedades definidas
    const campaign = await Campaign.findByPk(req.params.CampaignId, {
      attributes: ['id', 'name', 'managerId', 'region', 'commune', 'open', 'mapId', 'createdAt', 'updatedAt']
    });

    if (campaign) {
      const { managerId, createdAt, updatedAt, ...formattedCampaign } = campaign.dataValues;
      formattedCampaign.createdAt = formatDate(createdAt);
      formattedCampaign.updatedAt = formatDate(updatedAt);
      const manager = await User.findByPk(managerId, {
        attributes: ['name'],
        paranoid: false
      });
      formattedCampaign.managerId = managerId;
      formattedCampaign.manager = manager.dataValues.name;

      const users = await Campaign.findOne({
        attributes: ['id'],
        include: {
          model: User,
          attributes: ['id', 'name', 'run', 'dvRun', 'role'],
        },
        where: { id: campaign.id }
      });

      let supervisorCount = 0;
      let prospectorCount = 0;

      const formattedUsers = [];
      if (users) {
        for (const user of users.dataValues.Users) {
          formattedUsers.push({
            RegistrationId: user.dataValues.UserRegistration.dataValues.id,
            name: user.name,
            rut: user.run + '-' + user.dvRun,
            role: user.role,
          });
          if (user.role === 'supervisor') {
            supervisorCount++;
          } else if (user.role === 'prospector') {
            prospectorCount++;
          }
        }
      }

      const permissionLevel = getPermissionLevel(req.user.role);

      return res.render('index.html', { formattedCampaign, formattedUsers, fileHTML, title, single, roles: [roles.SUPERVISOR, roles.PROSPECTOR], permissionLevel, supervisorCount, prospectorCount });
    } else {
      return res.render('error.html', { error: 404 });
    }

  } catch (error) {
    console.error(error);
    return res.render('error.html', { error: 500 });
  }
};

// Agregar una campaña
export const addCampaign = async (req, res) => {
  try {
    // Valida que vengan datos en el cuerpo
    if (Object.keys(req.body).length === 0) {
      return res.status(400).json({ error: 'El cuerpo de la solicitud está vacío.' });
    }

    // Filtrar y validar el cuerpo de la solicitud
    const validatedObject = await validateRequestBody(req.body, Campaign);
    // Comprobar errores de validación
    if (validatedObject.error) {
      return res.status(400).json(validatedObject.error);
    }

    // Crear una nueva campaña en la base de datos y devolverla como respuesta
    const campaign = await Campaign.create(validatedObject);
    return res.status(201).json(campaign.toJSON());
  } catch (error) {
    console.error('Error al insertar una campaña', error);
    return res.status(500).json({ error: 'Ocurrió un error en el servidor' });
  }
};

// Editar campaña
export const updateCampaign = async (req, res) => {
  try {
    // Valida que vengan datos en el cuerpo
    if (Object.keys(req.body).length === 0) {
      return res.status(400).json('El cuerpo de la solicitud está vacío.');
    }

    // Validar el cuerpo de la solicitud
    const validatedFields = await validateFieldsDataType(req.body, Campaign);
    // Comprobar errores de validación
    if (validatedFields.errors) {
      return res.status(400).json(validatedFields.errors);
    }

    await Campaign.update(req.body, {
      where: {
        id: req.params.CampaignId
      }
    });

    if (typeof req.body.open != 'undefined' && !req.body.open) {
      await UserRegistration.destroy({
        where: {
          CampaignId: req.params.CampaignId
        }
      });

      const getIds = async (ids, model) => {
        const archive = await model.findAll({
          attributes: ['id'],
          where: ids,
          raw: true
        });
        return archive.map(single => single.id);
      }
      // Limpiar evidencias de la campaña
      const { CampaignId } = req.params;
      let ids = { CampaignId };
      const focusesIds = await getIds(ids, Focus);
      if (focusesIds.length > 0) {
        ids = { FocuId: { [Sequelize.Op.in]: focusesIds } };
        const blockRegistrationIds = await getIds(ids, BlockRegistration);
        if (blockRegistrationIds.length > 0) {
          ids = { BlockRegistrationId: { [Sequelize.Op.in]: blockRegistrationIds } };
          const houseRegistrationIds = await getIds(ids, HouseRegistration);
          if (houseRegistrationIds.length > 0) {
            ids = { HouseRegistrationId: { [Sequelize.Op.in]: houseRegistrationIds } };
            const treeSpeciesRegistrationIds = await getIds(ids, TreeSpeciesRegistration);
            if (treeSpeciesRegistrationIds.length > 0) {
              ids = treeSpeciesRegistrationIds.map(id => id.toString());
              const EVIDENCE_PATH = 'data/evidence';
              try {
                const files = await fsPromises.readdir(EVIDENCE_PATH);

                for (const file of files) {
                  const nombreArchivo = file.split('.')[0];
                  if (ids.includes(nombreArchivo)) {
                    const filePath = `${EVIDENCE_PATH}/${file}`;
                    await fsPromises.unlink(filePath);
                  }
                }

                console.log('Limpieza de evidencias completada.');
              } catch (error) {
                console.error('Error al limpiar las evidencias:', error);
              }
            }
          }
        }
      }

    }

    return res.sendStatus(200);
  } catch (error) {
    console.error('Error al actualizar la campaña', error);
    return res.status(500).json({ error: 'Ocurrió un error en el servidor' });
  }
}

// Quitar usuario de la campaña
export const deleteUserFromCampaign = async (req, res) => {
  try {
    // Valida que vengan datos en el cuerpo
    const deletedUser = await UserRegistration.destroy({
      where: {
        id: req.params.UserRegistrationId
      }
    });

    if (deletedUser) {
      return res.sendStatus(200);
    } else {
      return res.sendStatus(404);
    };
  } catch (error) {
    console.error('Error al actualizar la campaña', error);
    return res.sendStatus(500);
  }
}

// Listar usuarios que no pertenecen a ninguna campaña
export const getNonCampaignUsers = async (req, res) => {
  try {
    // Obtener usuarios que están registrados en la campaña
    // const campaignUsers = await Campaign.findByPk(req.params.CampaignId, {
    //   include: {
    //     model: User,
    //     attributes: ['id']
    //   }
    // });

    let userIds = [];
    // Obtener usuarios que están registrados en alguna campaña
    await UserRegistration.findAll({
      attributes: ['UserId']
    })
      .then(results => {
        userIds = results.map(result => result.UserId);
      })
      .catch(error => {
        console.error('Error:', error);
      });
    // const campaignUserIDs = campaignUsers.Users.map(({ dataValues }) => dataValues.id);

    const nonCampaignUsers = await User.findAll({
      where: {
        id: {
          [Sequelize.Op.notIn]: userIds
        },
        role: {
          [Sequelize.Op.in]: [roles.SUPERVISOR, roles.PROSPECTOR]
        }
      }
    });

    // Comprobar si existen usuarios disponibles
    if (!nonCampaignUsers) {
      return res.sendStatus(404);
    }

    // Formatear los usuarios para la respuesta
    const formattedUsers = nonCampaignUsers.map(user => ({
      id: user.id,
      name: user.name,
      rut: `${user.run}-${user.dvRun}`,
      role: user.role
    }));

    // Enviar usuarios formateados
    return res.status(200).json(formattedUsers);
  } catch (error) {
    console.error('Error en getNonCampaignUsers: ', error);
    return res.sendStatus(500);
  }
};

// Agregar usuarios a la campaña
export const addUsersToCampaign = async (req, res) => {
  try {
    // Valida que vengan datos en el cuerpo
    if (req.body.length == 0) {
      throw new Error('El cuerpo de la solicitud está vacío.');
    }

    const campaignId = parseInt(req.params.CampaignId);
    const userIDs = req.body.map(function (userID) {
      return parseInt(userID);
    });

    try {
      const campaign = await Campaign.findByPk(campaignId);
      if (!campaign) {
        throw new Error('Campaña no encontrada');
      }

      const users = await User.findAll({
        where: {
          id: userIDs
        }
      });

      if (users.length !== userIDs.length) {
        throw new Error('Alguno(s) de los usuarios no se encontraron');
      }

      await campaign.addUsers(users);
      return res.sendStatus(200);
    } catch (error) {
      console.error('Error al agregar usuarios a la campaña:', error);
    }

  } catch (error) {
    console.error('Error al insertar usuarios a la campaña', error);
    return res.sendStatus(500);
  }
};

export const generateReport = async (req, res) => {

  try {
    const campaignId = parseInt(req.params.CampaignId);

    const campaign = (await Campaign.findByPk(campaignId, {
      attributes: ['id', 'name', 'createdAt']
    })).dataValues;
    const focuses = await Focus.findAll({
      attributes: ['id', 'createdAt'],
      order: [['createdAt', 'DESC']],
      where: {
        CampaignId: campaign.id
      }
    });

    const focusIds = [];
    for (const focus of focuses) {
      focusIds.push(focus.dataValues.id);
    }
    const blockRegistrations = await BlockRegistration.findAll({
      attributes: ['id'],
      where: {
        FocuId: { [Sequelize.Op.in]: focusIds },
      }
    });

    const blockRegistrationIds = [];
    for (const blockRegistration of blockRegistrations) {
      blockRegistrationIds.push(blockRegistration.dataValues.id);
    }
    const houseRegistrations = await HouseRegistration.findAll({
      attributes: ['id'],
      where: {
        BlockRegistrationId: { [Sequelize.Op.in]: blockRegistrationIds },
      }
    });
    const houseRegistrationIds = [];
    for (const houseRegistration of houseRegistrations) {
      houseRegistrationIds.push(houseRegistration.dataValues.id);
    }

    const houseRegistrationsOpen = await HouseRegistration.findAll({
      attributes: ['id'],
      where: {
        BlockRegistrationId: { [Sequelize.Op.in]: blockRegistrationIds },
        state: states.OPEN,
      }
    });

    const houseRegistrationWithFruitSamplesIds = [];
    const treeSpeciesRegistrationMustHaveFruitSampleIds = [];
    for (const houseRegistrationOpen of houseRegistrationsOpen) {
      const treeSpeciesRegistrationsMustHaveFruitSample = await TreeSpeciesRegistration.findAll({
        where: {
          HouseRegistrationId: houseRegistrationOpen.dataValues.id,
          tree_state: { [Sequelize.Op.in]: [treeStates.RIPE, treeStates.UNRIPE] },
        }
      });
      if (treeSpeciesRegistrationsMustHaveFruitSample.length) {
        for (const treeSpeciesRegistrationMustHaveFruitSample of treeSpeciesRegistrationsMustHaveFruitSample) {
          treeSpeciesRegistrationMustHaveFruitSampleIds.push(treeSpeciesRegistrationMustHaveFruitSample.dataValues.id);
        }
      };
    }

    const prospects = await Prospectus.findAll({
      attributes: ['id', 'treeSpeciesRegistrationId'],
      where: {
        treeSpeciesRegistrationId: { [Sequelize.Op.in]: treeSpeciesRegistrationMustHaveFruitSampleIds },
      }
    });
    const prospectsIds = [];
    for (const prospectus of prospects) {
      prospectsIds.push(prospectus.dataValues.id);
    }
    for (const prospectusId of prospectsIds) {
      const { treeSpeciesRegistrationId } = (await Prospectus.findByPk(prospectusId, {
        attributes: ['treeSpeciesRegistrationId']
      })).dataValues;
      const { HouseRegistrationId } = (await TreeSpeciesRegistration.findByPk(treeSpeciesRegistrationId, {
        attributes: ['HouseRegistrationId'],
      })).dataValues;
      if (!houseRegistrationWithFruitSamplesIds.includes(HouseRegistrationId)) houseRegistrationWithFruitSamplesIds.push(HouseRegistrationId);
    }

    const treeSpeciesRegistrationHaveFruitSampleIds = [];
    for (const prospectus of prospects) {
      treeSpeciesRegistrationHaveFruitSampleIds.push(prospectus.dataValues.treeSpeciesRegistrationId);
    }
    // const treeSpeciesRegistrationWithoutSampleAndWhichShouldHave = treeSpeciesRegistrationMustHaveFruitSampleIds.filter(id => !treeSpeciesRegistrationHaveFruitSampleIds.includes(id));

    const prospectsAnalyzed = await Prospectus.findAll({
      attributes: ['id', 'number_of_samples', 'units_per_sample', 'weight', 'has_fly'],
      where: {
        treeSpeciesRegistrationId: { [Sequelize.Op.in]: treeSpeciesRegistrationMustHaveFruitSampleIds },
        analyst: { [Sequelize.Op.not]: null }
      }
    });

    let numberOfFruitSampleAnalyzed = 0;
    let numberOfFruitUnitsAnalyzed = 0;
    let numberOfFruitKilosAnalyzed = 0;
    const fruitSpeciesAnalyzed = [];
    let unitsOfInfestedFruit = 0;
    const fruitSpeciesInfested = [];
    const prospectusAnalyzedIds = [];
    const prospectusAnalyzedWithInfestedFruitIds = [];
    for (const prospectusAnalyzed of prospectsAnalyzed) {
      const prospectusAnalyzedId = prospectusAnalyzed.dataValues.id
      prospectusAnalyzedIds.push(prospectusAnalyzedId);
      const numberOfSamples = prospectusAnalyzed.dataValues.number_of_samples;
      const unitsPerSample = prospectusAnalyzed.dataValues.units_per_sample;
      const { weight } = prospectusAnalyzed.dataValues;
      const hasFly = prospectusAnalyzed.dataValues.has_fly;

      const fruitUnits = numberOfSamples * unitsPerSample;
      numberOfFruitSampleAnalyzed += numberOfSamples;
      numberOfFruitUnitsAnalyzed += fruitUnits;
      numberOfFruitKilosAnalyzed += numberOfSamples * weight;
      if (hasFly) {
        prospectusAnalyzedWithInfestedFruitIds.push(prospectusAnalyzedId);
        unitsOfInfestedFruit += fruitUnits;
      }
    }

    for (const prospectusAnalyzedId of prospectusAnalyzedIds) {
      const { treeSpeciesRegistrationId } = (await Prospectus.findByPk(prospectusAnalyzedId, {
        attributes: ['treeSpeciesRegistrationId']
      })).dataValues;
      const { TreeSpecyId } = (await TreeSpeciesRegistration.findByPk(treeSpeciesRegistrationId, {
        attributes: ['TreeSpecyId']
      })).dataValues;
      const { species } = (await TreeSpecies.findByPk(TreeSpecyId, {
        attributes: ['species']
      })).dataValues;
      if (!fruitSpeciesAnalyzed.includes(species)) fruitSpeciesAnalyzed.push(species);
    }

    for (const prospectusAnalyzedWithInfestedFruitId of prospectusAnalyzedWithInfestedFruitIds) {
      const { treeSpeciesRegistrationId } = (await Prospectus.findByPk(prospectusAnalyzedWithInfestedFruitId, {
        attributes: ['treeSpeciesRegistrationId']
      })).dataValues;
      const { TreeSpecyId } = (await TreeSpeciesRegistration.findByPk(treeSpeciesRegistrationId, {
        attributes: ['TreeSpecyId']
      })).dataValues;
      const { species } = (await TreeSpecies.findByPk(TreeSpecyId, {
        attributes: ['species']
      })).dataValues;
      if (!fruitSpeciesInfested.includes(species)) fruitSpeciesInfested.push(species);
    }

    const dateFirstDetection = campaign.createdAt;
    const dateLastDetection = focuses[0].dataValues.createdAt;
    const today = new Date();

    const format = 'D/MM/YYYY';
    const report = {
      campaignId: campaign.id,
      campaignName: campaign.name,
      todayDate: formatDate(today, format),
      dateFirstDetection: formatDate(dateFirstDetection, format),
      dateLastDetection: formatDate(dateLastDetection, format),
      numberTotalDetections: focuses.length,
      numberOfWeeksSinceLastDetection: calcularDiferenciaDeSemanas(dateLastDetection, today),
      numberOfWeeksSinceFirstDetection: calcularDiferenciaDeSemanas(dateFirstDetection, today),
      numberOfPlacesVisited: houseRegistrations.length,
      numberOfPlacesWithFruitSamples: houseRegistrationWithFruitSamplesIds.length,
      // treeSpeciesRegistrationWithoutSampleAndWhichShouldHave,
      numberOfFruitSampleAnalyzed,
      numberOfFruitUnitsAnalyzed,
      numberOfFruitKilosAnalyzed,
      fruitSpeciesAnalyzed,
      unitsOfInfestedFruit,
      fruitSpeciesInfested,
    };

    return res.status(200).json(report);

  } catch (error) {
    console.error('Error al generar el reporte: ', error);
    return res.sendStatus(404);
  }

};

const calcularDiferenciaDeSemanas = (fechaInicio, fechaFin) => {
  // Calcula la diferencia en milisegundos entre las fechas
  const diferenciaMilisegundos = fechaFin - fechaInicio;

  // Convierte la diferencia en semanas
  const unaSemanaEnMilisegundos = 1000 * 60 * 60 * 24 * 7;
  return Math.floor(diferenciaMilisegundos / unaSemanaEnMilisegundos);
}
