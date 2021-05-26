import * as Sequelize from 'sequelize';
import { VacancyInstance } from 'diploma';
import SequelizeInstance from '../config/SequelizeInstance';

export default SequelizeInstance.getSequelizeInstance().define<VacancyInstance>('vacancies', {
  id: {
    allowNull: false,
    type: Sequelize.UUID,
    defaultValue: Sequelize.UUIDV1,
    primaryKey: true,
  },
  projectId: {
    allowNull: false,
    type: Sequelize.UUID,
    references: {
      model: 'projects',
      key: 'id',
    },
  },
  role: {
    allowNull: false,
    type: Sequelize.STRING(255),
  },
  number: {
    allowNull: false,
    type: Sequelize.INTEGER,
    defaultValue: 1
  },
  requirements: {
    type: Sequelize.TEXT,
  }
});
