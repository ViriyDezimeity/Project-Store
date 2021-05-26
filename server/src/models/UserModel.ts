import * as Sequelize from 'sequelize';
import { UserInstance } from 'diploma';
import SequelizeInstance from '../config/SequelizeInstance';

export default SequelizeInstance.getSequelizeInstance().define<UserInstance>(
  'users',
  {
    id: {
      allowNull: false,
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV1,
      primaryKey: true,
    },
    firstName: {
      allowNull: false,
      type: Sequelize.STRING(255),
    },
    lastName: {
      allowNull: false,
      type: Sequelize.STRING(255),
    },
    patronymic: {
      type: Sequelize.STRING(255),
    },
    dateBirth: {
      type: Sequelize.DATE,
    },
    placeWork: {
      type: Sequelize.STRING(255),
    },
    phoneNumber: {
      allowNull: false,
      type: Sequelize.STRING(255),
    },
    mail: {
      allowNull: false,
      type: Sequelize.STRING(255),
    },
    login: {
      allowNull: false,
      type: Sequelize.STRING(255),
    },
    password: {
      allowNull: false,
      type: Sequelize.STRING(255),
    },
    aboutMe: {
      type: Sequelize.TEXT,
    },
    departmentId: {
      allowNull: false,
      type: Sequelize.UUID,
      references: {
        model: 'departments',
        key: 'id',
      },
    },
    roleId: {
      allowNull: false,
      type: Sequelize.UUID,
      defaultValue: 'b675969b-5ed1-4f56-a888-a96ee4874402',
      references: {
        model: 'roles',
        key: 'id',
      },
    },
  },
);
