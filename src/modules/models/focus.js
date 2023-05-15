import { DataTypes, Model } from 'sequelize';

const focusModel = (sequelize) => {

  class Focus extends Model { };

  Focus.init({
    //Dirección de donde se encuentra el foco
    addres: DataTypes.STRING(50),
    //Indica si el foco está activo o inactivo
    active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  }, {
    sequelize,
    modelName: 'Focus'
  });

  return Focus;

};

export default focusModel;