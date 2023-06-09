import { DataTypes, Model } from 'sequelize';

const teamModel = (sequelize) => {

  class Team extends Model { };

  Team.init({
    // Identificadores de manzanas que debe muestrear el equipo
    tasks: DataTypes.STRING(100),
  }, {
    sequelize,
    modelName: 'Team',
    timestamps: true,
    updatedAt: false,
  });

  return Team;

};

export default teamModel;
