import { DataTypes, Model } from 'sequelize';

const treeSpeciesModel = (sequelize) => {

  class TreeSpecies extends Model { };

  TreeSpecies.init({
    // Nombre de la especie de árbol
    species: DataTypes.STRING(50),
  }, {
    sequelize,
    modelName: 'TreeSpecies',
    tableName: 'tree_species',
    timestamps: false,
  });

  return TreeSpecies;

};

export default treeSpeciesModel;
