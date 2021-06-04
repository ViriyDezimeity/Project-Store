import * as Sequelize from 'sequelize';
import { ProjectInstance } from 'diploma';
import SequelizeInstance from '../config/SequelizeInstance';
import UserModel from './UserModel';

const ProjectModel: Sequelize.ModelCtor<ProjectInstance> = SequelizeInstance.getSequelizeInstance()
  .define<ProjectInstance>('projects', {
    id: {
      allowNull: false,
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV1,
      primaryKey: true,
    },
    title: {
      allowNull: false,
      type: Sequelize.STRING(255),
    },
    description: {
      allowNull: false,
      type: Sequelize.TEXT,
    },
    customer: {
      allowNull: false,
      type: Sequelize.STRING(255),
    },
    dateBegin: {
      allowNull: false,
      type: Sequelize.DATE,
      defaultValue: Sequelize.NOW,
    },
    dateEnd: {
      allowNull: false,
      type: Sequelize.DATE,
      defaultValue: Sequelize.NOW,
    },
    controlPoints: {
      type: Sequelize.TEXT,
    },
    result: {
      type: Sequelize.TEXT,
    },
    managerId: {
      allowNull: false,
      type: Sequelize.UUID,
      references: {
        model: 'users',
        key: 'id',
      },
    },
  });

ProjectModel.belongsTo(UserModel, {
  as: 'manager',
  foreignKey: 'managerId',
  onDelete: 'CASCADE',
});

export default ProjectModel;
