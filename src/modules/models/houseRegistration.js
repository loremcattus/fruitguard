import { DataTypes, Model } from 'sequelize';

import { states, areas } from '../../helpers/enums.js';

const statesValues = Object.values(states);
const areasValues = Object.values(areas);

const houseRegistrationModel = (sequelize) => {

  class HouseRegistration extends Model { };

  HouseRegistration.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true // Automatically gets converted to SERIAL for postgres
    },
    //	sector de la grilla en que se encuentra
    grid: DataTypes.INTEGER,
    // 	comentario opcional asociado al registro de la casa
    comment: {
      type: DataTypes.STRING(500),
      defaultValue: null,
    },
    // area en que se encuentra
    area_id: {
      type: DataTypes.ENUM(...areasValues),
      validate: {
        isIn: {
          args: [areasValues],
          msg: `Invalid role. Valid roles are: ${areasValues.join(', ')}`,
        },
      },
    },
    // estado de la casa
    state_id: {
      type: DataTypes.ENUM(...statesValues),
      defaultValue: states.STATE,
      validate: {
        isIn: {
          args: [statesValues],
          msg: `Invalid state. Valid state are: ${statesValues.join(', ')}`,
        },
      },
    },
  }, {
    sequelize,
    paranoid: true,
    modelName: 'HouseRegistration',
    tableName: 'house_registrations',
  });

  return HouseRegistration;

};

export default houseRegistrationModel;