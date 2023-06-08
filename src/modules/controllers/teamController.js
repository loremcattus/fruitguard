import models from '../models/index.js';
const { UserRegistration, User, Team, Car, Sequelize } = models;

const clearTeams = async () => {
  // Obtener el día actual
  const today = new Date().toISOString().slice(0, 10);
  const team = await Team.findOne({
    attributes: ['createdAt']
  });

  if (!team) return;

  // Extraer el día de creación del equipo
  const teamCreatedDay = team.dataValues.createdAt.toISOString().slice(0, 10);

  if (today !== teamCreatedDay) {
    await UserRegistration.update({ TeamId: null }, {
      where: {
        TeamId: { [Sequelize.Op.not]: null }
      }
    });
    await Car.update({ TeamId: null }, {
      where: {
        TeamId: { [Sequelize.Op.not]: null }
      }
    });
    await Team.destroy({ truncate: true });
  }
}

// Obtener todas las campañas
export const getTeams = async (req, res) => {
  const fileHTML = 'list-teams';
  const title = 'Equipos';
  const formattedTeams = [];

  try {
    // TODO: Preguntar que opinan, porque tal vez sea mejor dejarlo creado, en caso de quitarlo, limpiar createdAt del modelo
    clearTeams();

    const supervisorId = 7; // 7 u 8

    const supervisorRegistration = await UserRegistration.findOne({
      attributes: ['id', 'CampaignId'],
      where: { UserId: supervisorId }
    });

    const CampaignId = supervisorRegistration.dataValues.CampaignId;

    const usersRegistration = await UserRegistration.findAll({
      attributes: ['id', 'UserId'],
      include: {
        model: Team
      },
      where: {
        CampaignId,
        TeamId: { [Sequelize.Op.not]: null }
      }
    });

    // No existen usuarios con equipos asignados
    if (usersRegistration.length == 0) return res.render('index.html', { formattedTeams, fileHTML, title });

    const userIds = usersRegistration.map(registration => registration.dataValues.UserId);
    const teamIds = [...new Set(usersRegistration.map(registration => registration.Team.dataValues.id))];

    const cars = {};
    const tasks = [];

    for (let i = 0; i < teamIds.length; i++) {
      const teamId = teamIds[i];
      const team = await Team.findByPk(teamId);

      const numberOfBlocks = team.dataValues.tasks.split(',').length;

      const car = await team.getCar({
        attributes: ['patent', 'capacity']
      });

      const { patent, capacity } = car.dataValues;

      cars[teamId] = { patent, capacity };
      tasks.push({ team: teamId, numberOfBlocks });
    }

    const users = await User.findAll({
      attributes: ['id', 'name', 'hasLicense'],
      where: {
        id: { [Sequelize.Op.in]: userIds },
      }
    });

    for (let i = 0; i < users.length; i++) {
      const { id, name, hasLicense } = users[i].dataValues;
      const foundUser = usersRegistration.find(registration => registration.dataValues.UserId === id);

      if (foundUser) {
        const team = foundUser.Team.dataValues.id;
        const existingTeam = formattedTeams.find(item => item.team === team);

        if (existingTeam) {
          existingTeam.users.push({ id, name, hasLicense });
        } else {
          formattedTeams.push({ team, users: [{ id, name, hasLicense }], car: {}, tasks: 0 });
        }
      }
    }

    for (let i = 0; i < tasks.length; i++) {
      const { team, numberOfBlocks } = tasks[i];
      const existingTeam = formattedTeams.find(item => item.team === team);

      if (existingTeam) {
        existingTeam.tasks += numberOfBlocks;
      }
    }

    // Asignar los valores de cars a la propiedad car de cada equipo en formattedTeams
    formattedTeams.forEach(team => {
      const teamId = team.team;
      if (cars.hasOwnProperty(teamId)) {
        team.car = cars[teamId];
      }
    });

    console.log(formattedTeams[0]);

    return res.render('index.html', { formattedTeams, fileHTML, title });
  } catch (error) {
    console.error('Error al obtener equipos: ', error);
    return res.sendStatus(500);
  }
};
