import { DataTypes, Model } from 'sequelize';

const campaignModel = (sequelize) => {

  class Campaign extends Model { };

  Campaign.init({
    // Nombre de la campaña
    name: DataTypes.STRING(50),
    // Indica si la campaña está abierta o cerrada
    open: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    // Región a la que pertenece la campaña
    region: DataTypes.STRING(50),
    // Comuna a la que pertenece la campaña
    commune: DataTypes.STRING(50),
    // Identificador y nombre del archivo que contiene la imagen del mapa asociado a la campaña
    mapId: {
      type: DataTypes.INTEGER,
      defaultValue: null,
    },
  }, {
    sequelize,
    paranoid: true,
    modelName: 'Campaign'
  });

  return Campaign;

};

export default campaignModel;
