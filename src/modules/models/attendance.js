import { DataTypes, Model } from 'sequelize';

const attendanceModel = (sequelize) => {

  class Attendance extends Model { };

  Attendance.init({
    // Identificador del usuario al que se tomó la asistencia
    userId: DataTypes.INTEGER,
    // Indica si el usuario estuvo ausente o presente
    isPresent: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  }, {
    sequelize,
    modelName: 'Attendance',
    timestamps: true,
    updatedAt: false,
  });

  return Attendance;

};

export default attendanceModel;
