import * as Sequelize from 'sequelize';
import { VacancyUserInstance } from 'diploma';
import SequelizeInstance from '../config/SequelizeInstance';

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

export default VacancyUserModel;
