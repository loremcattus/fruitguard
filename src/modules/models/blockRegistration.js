import { DataTypes, Model } from "sequelize";


const blockRegistrationModel = (sequelize) => {

  class BlockRegistration extends Model { };

  BlockRegistration.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true // Automatically gets converted to SERIAL for postgres
    }
  }, {
    sequelize,
    paranoid: true,
    timestamps: true,
    updatedAt: false,
    modelName: 'BlockRegistration',
    tableName: 'block_registrations',
  });

  return BlockRegistration;

};

export default blockRegistrationModel;
