import { DataTypes, Model } from 'sequelize';

import { treeStates } from '../../helpers/enums.js';

const treeStatesValues = Object.values(treeStates);

const treeSpeciesRegistrationModel = (sequelize) => {

  class TreeSpeciesRegistration extends Model { };

  TreeSpeciesRegistration.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true // Automatically gets converted to SERIAL for postgres
    },
    // Cantidad de árboles de la especie en concreto encontrados en el registro de la casa
    tree_number: DataTypes.INTEGER,
    // Estado del árbol, se considera el árbol en peor estado (con fruta madura) hacia abajo (árbol nuevo)
    tree_state: {
      type: DataTypes.ENUM(...treeStatesValues),
      validate: {
        isIn: {
          args: [treeStatesValues],
          msg: `Invalid tree state, Valid tree states are: ${treeStatesValues.join(', ')}`,
        },
      },
    },
  }, {
    sequelize,
    modelName: 'TreeSpeciesRegistration',
    tableName: 'treespecies_registrations',
    timestamps: false,
  });

  return TreeSpeciesRegistration;

};

export default treeSpeciesRegistrationModel;