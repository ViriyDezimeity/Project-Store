import * as Sequelize from 'sequelize';
import { VacancyInstance } from 'diploma';
import SequelizeInstance from '../config/SequelizeInstance';
import ProjectModel from './ProjectModel';

const VacancyModel: Sequelize.ModelCtor<VacancyInstance> = SequelizeInstance.getSequelizeInstance()
  .define<VacancyInstance>('vacancies', {
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
      defaultValue: 1,
    },
    currentNumber: {
      allowNull: false,
      type: Sequelize.INTEGER,
      defaultValue: 0,
    },
    requirements: {
      type: Sequelize.TEXT,
    },
  });

VacancyModel.belongsTo(ProjectModel, {
  as: 'project',
  foreignKey: 'projectId',
  onDelete: 'CASCADE',
});

export default VacancyModel;
