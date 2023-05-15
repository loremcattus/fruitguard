import dotenv from 'dotenv';
import { Sequelize, DataTypes, Model } from 'sequelize';
import userModel from  './user.js';
import campaignModel from  './campaign.js';
import userRegistrationModel from  './userRegistration.js';
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
}

// Crear la conexión de Sequelize
const sequelize = new Sequelize(database, user, password, { host, dialect, logging: false });

try {
  await sequelize.authenticate();
  console.log('Database connection has been established successfully.');
} catch (error) {
  throw console.error('Unable to connect to the database:', error);
}

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
};

// ASSOCIATIONS

// Usuario N:M Campaña (a través de Registro de Usuario)
models.Campaign.belongsToMany(models.User, { through: models.UserRegistration }); // Una campaña está compuesta por muchos usuarios
models.User.belongsToMany(models.Campaign, { through: models.UserRegistration }); // Un usuario participa en muchas campañas
// Campaña 1:N Equipo
models.Campaign.hasMany(models.Team); // Una campaña está compuesta por muchos equipos
models.Team.belongsTo(models.Campaign); // Un equipo pertenece a una campaña
// Auto 1:N Equipo
models.Car.hasMany(models.Team); // Un auto puede ser utilizado por un equipo
models.Team.belongsTo(models.Car); // Un equipo utiliza un auto
// Campaña 1:N Foco
models.Campaign.hasMany(models.Focus); // Una campaña está compuesta por uno o varios focos
models.Focus.belongsTo(models.Campaign); // Un foco pertenece a una campaña
// Foco N:M Manzana (a través de Registro de Manzana)
// Registro de Manzana N:M Casa (a través de Registro de Casa) TODO: REVISAR

// SYNCHRONIZE
models.sequelize.sync({ force })
  .then(() => console.log('Database synchronized with models.'))
  .catch(error => console.error('Error synchronizing database with models:', error));

export default models;
