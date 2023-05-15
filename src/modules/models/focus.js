import { DataTypes, Model } from 'sequelize';

const focusModel = (sequelize) => {

    class Focus extends Model { };

    Focus.init({
    //Dirección de donde se encuentra el foco
    addres: DataTypes.STRING(50),
    //Indica si el foco está activo o no(?)
    active:{
        type: DataTypes.BOOLEAN,
        defaultValue: true,
    },
    },{
        sequelize,
        paranoid: true,
        modelName: 'Focus'
    });
    
    return Focus;   

};

export default focusModel;