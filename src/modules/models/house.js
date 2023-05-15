import {  DataTypes, Model } from "sequelize";

const houseModel = ( sequelize ) =>{

    class House extends Model{ };

    House.init({
        //Dirección de la casa
        addres: DataTypes.STRING(50),
    },{
        sequelize,
        paranoid: true,
        modelName: 'House',
        createdAt: false,
    });
    
    return House;
    
;}

export default houseModel;