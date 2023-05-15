import { DataTypes, Model } from 'sequelize';

import { treeStates } from '../../helpers/enums.js';

const treeStatesValues = Object.values(treeStates);

const treeSpeciesRegistration = ( sequelize ) => {

    class TreeSpeciesRegistration extends Model {};

    TreeSpeciesRegistration.init({
      // Cantidad de árboles de la especie en concreto encontrados en el registro de la casa
      tree_number: DataTypes.INTEGER,
			// Especie del árbol a registrar
			tree_species_id: DataTypes.INTEGER,
			// Estado del árbol, se considera el árbol en peor estado (con fruta madura) hacia abajo (árbol nuevo)
			tree_state_id: {
				type: DataTypes.ENUM(...treeStatesValues),
				validate: {
					isIn: {
						args: [treeStatesValues],
						msg: `Invalid role, Valid tree states are: ${treeStatesValues.join(', ')}`,
					},
				},
			},
			// Registro de casa asociado
			house_registration_id: DataTypes.INTEGER,
			// Prospecto asociado en caso de tener como estado: con fruta madura
			prospectus_id: DataTypes.INTEGER,
			// Foto opcional para evidenciar el estado del árbol
			tree_evidence_id: DataTypes.INTEGER,

    }, {
			sequelize,
			modelName: 'TreeSpeciesRegistration',
			tableName: 'tree_species_registration',
			timestamps: false,
	});

	return TreeSpeciesRegistration;

};

export default treeSpeciesRegistration;