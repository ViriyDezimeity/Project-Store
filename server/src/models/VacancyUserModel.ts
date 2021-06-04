import * as Sequelize from 'sequelize';
import {
  VacancyUserInstance,
} from 'diploma';
import SequelizeInstance from '../config/SequelizeInstance';
import VacancyModel from './VacancyModel';
import UserModel from './UserModel';

const VacancyUserModel = SequelizeInstance.getSequelizeInstance()
  .define<VacancyUserInstance>(
    'vacancies_users',
    {
      vacancyId: {
        allowNull: false,
        type: Sequelize.UUID,
        references: {
          model: 'vacancies',
          key: 'id',
        },
      },
      userId: {
        allowNull: false,
        type: Sequelize.UUID,
        references: {
          model: 'users',
          key: 'id',
        },
      },
    },
  );

VacancyUserModel.removeAttribute('id');

VacancyUserModel.belongsTo(VacancyModel, {
  as: 'vacancy',
  foreignKey: 'vacancyId',
  onDelete: 'CASCADE',
});

VacancyUserModel.belongsTo(UserModel, {
  as: 'user',
  foreignKey: 'userId',
});

export default VacancyUserModel;
