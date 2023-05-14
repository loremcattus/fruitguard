import { DataTypes, Model } from 'sequelize';

const carModel = ( sequelize ) => {
    
    class Car extends Model {};

    Car.init({
        // Patente del auto
        patent: DataTypes.STRING(6),
        //	Capacidad de personas que caben en el auto por defecto caben 2 personas
        capacity: {
            type: DataTypes.INTEGER,
            defaultValue: 2,
        },
        //	Indica si el auto esta funcional y habilitado para asignarse a algún equipo por defecto esta disponible para su uso	
        available: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
        }
    }, {
        sequelize,
        modelName: 'Car',
        timestamps: false,
    });

    return Car;

};

export default carModel;