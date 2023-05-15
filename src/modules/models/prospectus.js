import { DataTypes, Model } from "sequelize";

const prospectusModel = (sequelize) => {

  class Prospectus extends Model { };

  Prospectus.init({
    // Unidades de fruta por muestra asociada al prospecto
    units_per_sample: DataTypes.INTEGER,
    // Indica si se ha encontrado mosca en la fruta de la muestra, por defecto no se ha encontrado
    has_fly: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    // Id del usuario analista que analizó la muestra
    analyst: {
      type: DataTypes.INTEGER,
      defaultValue: null,
    },
    // Peso total de la muestra en kilogramos
    weight: {
      type: DataTypes.DECIMAL(10, 0),
      defaultValue: null,
    }
  }, {
    sequelize,
    modelName: 'Prospectus',
    timestamps: true,
    createdAt: false,
  });

  return Prospectus;

};

export default prospectusModel;