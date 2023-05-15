import { DataTypes, Model } from 'sequelize';

const userRegistrationModel = (sequelize) => {

  class UserRegistration extends Model { };

  UserRegistration.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true // Automatically gets converted to SERIAL for postgres
    }
  }, {
    sequelize,
    modelName: 'UserRegistration',
    tableName: 'user_registrations',
    timestamps: false,
  });

  return UserRegistration;

};

export default userRegistrationModel;
