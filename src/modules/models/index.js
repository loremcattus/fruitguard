import dotenv from 'dotenv';
import { Sequelize, DataTypes, Model } from 'sequelize';
import userModel from  './user.js';
import campaignModel from  './campaign.js';
import userRegisterModel from  './userRegister.js';

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

// Modelos
const models = {
  force,
  Sequelize,
  sequelize,
  User: userModel(sequelize),
  Campaign: campaignModel(sequelize),
  UserRegister: userRegisterModel(sequelize),
};

// Associations
models.Campaign.belongsToMany( models.User, { through: models.UserRegister } ); // Relación muchos a muchos entre Campaign y User
models.User.belongsToMany( models.Campaign, { through: models.UserRegister } ); // Relación muchos a muchos entre User y Campaign

// Synchronize
models.sequelize.sync({ force })
  .then(() => console.log('Database synchronized with models.'))
  .catch(error => console.error('Error synchronizing database with models:', error));

export default models;
