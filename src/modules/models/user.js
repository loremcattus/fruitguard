import { DataTypes, Model } from 'sequelize';

import { roles } from '../../helpers/enums.js';

const rolesValues = Object.values(roles);

const userModel = (sequelize) => {

  class User extends Model { };

  User.init({
    // Nombre del usuario
    name: DataTypes.STRING(100),
    // RUT del usuario
    run: DataTypes.INTEGER,
    dvRun: DataTypes.CHAR(1),
    // Correo electrónico del usuario
    email: DataTypes.STRING(250),
    // Contraseña del usuario
    password: DataTypes.STRING(300), // https://sequelize.org/docs/v6/core-concepts/getters-setters-virtuals/#setters
    // Indica si tiene una licencia de conducir
    hasLicense: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    role: {
      type: DataTypes.ENUM(...rolesValues),
      defaultValue: roles.PROSPECTOR,
      validate: {
        isIn: {
          args: [rolesValues],
          msg: `Invalid role. Valid roles are: ${rolesValues.join(', ')}`,
        },
      },
    },
  }, {
    sequelize,
    paranoid: true,
    modelName: 'User'
  });

  return User;

};

export default userModel;
