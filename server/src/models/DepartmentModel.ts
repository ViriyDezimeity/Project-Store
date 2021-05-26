import * as Sequelize from 'sequelize';
import { DepartmentInstance } from 'diploma';
import SequelizeInstance from '../config/SequelizeInstance';

export default SequelizeInstance.getSequelizeInstance().define<DepartmentInstance>('departments', {
  id: {
    allowNull: false,
    type: Sequelize.UUID,
    defaultValue: Sequelize.UUIDV1,
    primaryKey: true,
  },
  departmentName: {
    allowNull: false,
    type: Sequelize.STRING(255),
  },
});
