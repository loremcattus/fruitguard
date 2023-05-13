import { DataTypes, Model } from 'sequelize';

const teamModel = (sequelize) => {

  class Team extends Model { };

  Team.init({
    // Identificadores de manzanas que debe muestrear el equipo
    tasks: DataTypes.STRING(100),
    // Identificadores de usuarios que pertenecen al equipo
    users: DataTypes.STRING(30),
  }, {
    sequelize,
    modelName: 'Team',
    timestamps: false,
  });

  return Team;

};

export default teamModel;
