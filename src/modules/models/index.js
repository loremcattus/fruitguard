import dotenv from 'dotenv';
import { Sequelize, DataTypes, Model } from 'sequelize';
import userModel from './user.js';
import campaignModel from './campaign.js';
import userRegisterModel from './userRegister.js';
import attendanceModel from './attendance.js';
import teamModel from './team.js';
import treeSpeciesModel from './treeSpecies.js';

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
  UserRegister: userRegisterModel(sequelize),
  Team: teamModel(sequelize),
  TreeSpecies: treeSpeciesModel(sequelize),
};

// ASSOCIATIONS

// Usuario N:M Campaña (a través de Registro de Usuario)
models.Campaign.belongsToMany(models.User, { through: models.UserRegister }); // Una campaña está compuesta por muchos usuarios
models.User.belongsToMany(models.Campaign, { through: models.UserRegister }); // Un usuario participa en muchas campañas
// Campaña 1:N Equipo
models.Campaign.hasMany(models.Team); // Una campaña está compuesta por muchos equipos
models.Team.belongsTo(models.Campaign); // Un equipo pertenece a una campaña
// Auto 1:N Equipo
// Campaña 1:N Foco
// Foco N:M Manzana (a través de Registro de Manzana)
// Registro de Manzana N:M Casa (a través de Registro de Casa) TODO: REVISAR

// SYNCHRONIZE
models.sequelize.sync({ force })
  .then(() => console.log('Database synchronized with models.'))
  .catch(error => console.error('Error synchronizing database with models:', error));

export default models;
