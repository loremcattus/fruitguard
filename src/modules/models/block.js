import { DataTypes, Model } from "sequelize";

const blockModel = (sequelize) => {

  class Block extends Model { };

  Block.init({
    //Nombres de las calles que limitan una manzana
    streets: DataTypes.STRING(250),
  }, {
    sequelize,
    timestamps: true,
    updatedAt: false,
    modelName: 'Block',
  });

  return Block;

};

export default blockModel;