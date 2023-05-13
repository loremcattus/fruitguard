import { Model } from 'sequelize';

const userRegisterModel = (sequelize) => {

  class UserRegister extends Model { };

  UserRegister.init({}, {
    sequelize,
    modelName: 'UserRegister',
    tableName: 'user_registers',
    timestamps: false,
  });

  return UserRegister;

};

export default userRegisterModel;
