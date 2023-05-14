import { DataTypes, Model } from 'sequelize';

import { state } from '../../helpers/enums.js';

const statesValues = Object.values(state);
const areasValues = Object.values(areas);

const houseRegistrationModel = ( sequelize ) => {

    class HouseRegistration extends Model {};

    HouseRegistration.init({
        //	sector de la grilla en que se encuentra
        grid: DataTypes.INTEGER,
        // 	comentario opcional asociado al registro de la casa
        comment: {
            type: DataTypes.STRING(500),
            defaultValue: null,
        },
        // area en que se encuentra
        area_id: DataTypes.INTEGER,
        // estado de la casa
        state_id: {
            type: DataTypes.ENUM(...statesValues),
            defaultValue: states.STATE,
            validate: {
                isIn: {
                    args: [statesValues],
                    msg: `Invalid state. Valid state are: ${statesValues.join(', ')}`,
                },
            },
        },
        house_id: {
            type: DataTypes.ENUM(...areasValues),
            validate: {
                isIn: {
                    args: [areasValues],
                    msg: `Invalid role. Valid roles are: ${areasValues.join(', ')}`,
                },
            },
        },
        block_registration: DataTypes.INTEGER,
        team_id: DataTypes.INTEGER
    }, {
        sequelize,
        paranoid: true,
        modelName: 'HouseRegistration'
    });

    return HouseRegistration;

};

export default houseRegistrationModel;