import { DataTypes, Model } from "sequelize";

const blockModel = ( sequelize ) => {

    class Block extends Model{ };

    Block.init({
        //Nombres de las Calles que compone una Manzana
        streets: DataTypes.STRING(150),
    },{
        sequelize,
        modelName: 'Block',
        timestamps: false ,
    });
    
    return Block;
    
;}

export default blockModel;