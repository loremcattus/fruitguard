import { DataTypes, Model } from "sequelize";


const blockRegistrationModel = (sequelize) => {

  class BlockRegistration extends Model { };

  BlockRegistration.init({}, {
    sequelize,
    paranoid: true,
    modelName: 'BlockRegistration',
    tableName: 'block_registration',
  });

  return BlockRegistration;

};

export default blockRegistrationModel;
