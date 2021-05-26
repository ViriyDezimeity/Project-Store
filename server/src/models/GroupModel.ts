import * as Sequelize from 'sequelize';
import { GroupInstance } from 'diploma';
import SequelizeInstance from '../config/SequelizeInstance';

export default SequelizeInstance.getSequelizeInstance().define<GroupInstance>('groups', {
  id: {
    allowNull: false,
    type: Sequelize.UUID,
    defaultValue: Sequelize.UUIDV1,
    primaryKey: true,
  },
  course: {
    allowNull: false,
    type: Sequelize.STRING(1),
  },
  group: {
    allowNull: false,
    type: Sequelize.STRING(5),
  },
  departmentId: {
    allowNull: false,
    type: Sequelize.UUID,
    references: {
      model: 'departments',
      key: 'id',
    },
  },
});
