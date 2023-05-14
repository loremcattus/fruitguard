import { Model } from 'sequelize';

const userRegistrationModel = (sequelize) => {

  class UserRegistration extends Model { };

  UserRegistration.init({}, {
    sequelize,
    modelName: 'UserRegistration',
    tableName: 'user_registrations',
    timestamps: false,
  });

  return UserRegistration;

};

export default userRegistrationModel;
