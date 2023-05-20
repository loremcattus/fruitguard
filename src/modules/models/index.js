import dotenv from 'dotenv';
import { Sequelize } from 'sequelize';
import { seed } from '../../../data/seed.js';
import userModel from './user.js';
import campaignModel from './campaign.js';
import userRegistrationModel from './userRegistration.js';
import attendanceModel from './attendance.js';
import teamModel from './team.js';
import treeSpeciesModel from './treeSpecies.js';
import prospectusModel from './prospectus.js';
import carModel from './car.js';
import houseRegistrationModel from './houseRegistration.js';
import focusModel from './focus.js';
import blockModel from './block.js';
import blockRegistrationModel from './blockRegistration.js';
import houseModel from './house.js';
import treeSpeciesRegistrationModel from './treeSpeciesRegistration.js';

dotenv.config();

// Obtener las variables de entorno
const {
  HOST: host,
  DB_FORCE: db_force,
  DB_NAME: database,
  DB_USERNAME: user,
  DB_PASSWORD: password,
  DB_DIALECT: dialect,
} = process.env;


let force = false
// Verifica si el valor de force existe y no está vacío
if (db_force && db_force === "true") {
  force = true;
};

// Crear la conexión de Sequelize
const sequelize = new Sequelize(database, user, password, { host, dialect, logging: false });

try {
  await sequelize.authenticate();
  console.log('Database connection has been established successfully.');
} catch (error) {
  throw console.error('Unable to connect to the database:', error);
};

// MODELS
const models = {
  force,
  Sequelize,
  sequelize,
  User: userModel(sequelize),
  Attendance: attendanceModel(sequelize),
  Campaign: campaignModel(sequelize),
  UserRegistration: userRegistrationModel(sequelize),
  Car: carModel(sequelize),
  Team: teamModel(sequelize),
  HouseRegistration: houseRegistrationModel(sequelize),
  TreeSpecies: treeSpeciesModel(sequelize),
  Prospectus: prospectusModel(sequelize),
  Focus: focusModel(sequelize),
  Block: blockModel(sequelize),
  BlockRegistration: blockRegistrationModel(sequelize),
  House: houseModel(sequelize),
  TreeSpeciesRegistration: treeSpeciesRegistrationModel(sequelize),
};

// ASSOCIATIONS
// https://sequelize.org/docs/v6/other-topics/legacy/#foreign-keys
// Usuario N:M Campaña (a través de Registro de Usuario)
models.Campaign.belongsToMany(models.User, { through: models.UserRegistration }, { foreignKey: 'CampaignId' }); // Una campaña está compuesta por muchos usuarios
models.User.belongsToMany(models.Campaign, { through: models.UserRegistration }, { foreignKey: 'UserId' }); // Un usuario participa en muchas campañas
// Campaña 1:N Equipo
models.Campaign.hasMany(models.Team, { foreignKey: 'CampaignId' }); // Una campaña está compuesta por muchos equipos
models.Team.belongsTo(models.Campaign, { foreignKey: 'CampaignId' }); // Un equipo pertenece a una campaña
// Auto 1:N Equipo
models.Car.hasMany(models.Team, { foreignKey: 'CarId' }); // Un auto puede ser utilizado por un equipo
models.Team.belongsTo(models.Car, { foreignKey: 'CarId' }); // Un equipo utiliza un auto
// Campaña 1:N Foco
models.Campaign.hasMany(models.Focus, { foreignKey: 'CampaignId' }); // Una campaña está compuesta por uno o varios focos
models.Focus.belongsTo(models.Campaign, { foreignKey: 'CampaignId' }); // Un foco pertenece a una campaña
// Manzana 1:N Casa
models.Block.hasMany(models.House, { foreignKey: 'BlockId' });
models.House.belongsTo(models.Block, { foreignKey: 'BlockId' });
// Foco N:M Manzana (a través de Registro de Manzana)
models.Focus.belongsToMany(models.Block, { through: models.BlockRegistration }, { foreignKey: 'FocusId' }); // Una campaña está compuesta por muchos usuarios
models.Block.belongsToMany(models.Focus, { through: models.BlockRegistration }, { foreignKey: 'BlockId' }); // Un usuario participa en muchas campañas
// Registro de Manzana N:M Casa (a través de Registro de Casa)
models.BlockRegistration.belongsToMany(models.House, { through: models.HouseRegistration }, { foreignKey: 'BlockRegistrationId' });
models.House.belongsToMany(models.BlockRegistration, { through: models.HouseRegistration }, { foreignKey: 'HouseId' });
// Registro de Casa N:M Especie de Árbol
models.HouseRegistration.belongsToMany(models.TreeSpecies, { through: models.TreeSpeciesRegistration }, { foreignKey: 'HouseRegistrationId' });
models.TreeSpecies.belongsToMany(models.HouseRegistration, { through: models.TreeSpeciesRegistration }, { foreignKey: 'TreeSpeciesId' });
// Registro de Especie de Árbol 1:1 Prospecto
models.TreeSpeciesRegistration.hasOne(models.Prospectus, { foreignKey: 'treeSpeciesRegistrationId' });
models.Prospectus.belongsTo(models.TreeSpeciesRegistration, { foreignKey: 'treeSpeciesRegistrationId' });

// SYNCHRONIZE
models.sequelize.sync({ force })
  .then(() => console.log('Database synchronized with models.'))
  .catch(error => console.error('Error synchronizing database with models:', error))
  .then(() => seed(models));

export default models;
