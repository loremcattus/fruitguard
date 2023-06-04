import models from '../models/index.js';
import { validateRequestBody, formatDate, validateFieldsDataType } from '../../helpers/validators.js';
import { roles } from '../../helpers/enums.js';

const { Campaign, User, UserRegistration, Sequelize } = models;

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

      const { nameOrRun, role } = req.query; // Obtener los parámetros de búsqueda de la URL
      let name = '';
      let run = '';
      
      if(nameOrRun){
        if(isNumeric(nameOrRun)) {
          run = nameOrRun;
        } else {
          name = { [Sequelize.Op.substring]: nameOrRun };
        }
      }

      // Construir el objeto de búsqueda dinámicamente
      const searchOptions = {
        ...(name && { name }),
        ...(run && {run}),
        ...(role && { role })
      };

      const users = await Campaign.findOne({
        attributes: ['id'],
        include: {
          model: User,
          attributes: ['id', 'name', 'run', 'dvRun', 'role'],
          where: searchOptions
        },
        where: { id: campaign.id }
      });

      const formattedUsers = [];
      if (users) {
        for (const user of users.dataValues.Users) {
          formattedUsers.push({
            RegistrationId: user.dataValues.UserRegistration.dataValues.id,
            name: user.name,
            rut: user.run + '-' + user.dvRun,
            role: user.role,
          });
        }
      }

      return res.render('index.html', { formattedCampaign, formattedUsers, fileHTML, title, single, roles: [roles.SUPERVISOR, roles.PROSPECTOR] });
    } else {
      return res.render('error.html', { error: 404 });
    }

  } catch (error) {
    console.log(error);
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

    let campaign = await Campaign.update(req.body, {
      where: {
        id: req.params.CampaignId
      }
    });

    console.log(campaign);

    return res.status(200).json(campaign);
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

// Listar usuarios que no pertenecen a la campaña
export const getNonCampaignUsers = async (req, res) => {
  try {
    // Obtener usuarios que están registrados en la campaña
    const campaignUsers = await Campaign.findByPk(req.params.CampaignId, {
      include: {
        model: User,
        attributes: ['id']
      }
    });

    const campaignUserIDs = campaignUsers.Users.map(({ dataValues }) => dataValues.id);

    const nonCampaignUsers = await User.findAll({
      where: {
        id: {
          [Sequelize.Op.notIn]: campaignUserIDs
        },
        role: {
          [Sequelize.Op.in]: [roles.SUPERVISOR, roles.PROSPECTOR]
        }
      }
    });

    // Comprobar si existen usuarios que no están registrados en la campaña
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
    // console.log(formattedUsers);

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