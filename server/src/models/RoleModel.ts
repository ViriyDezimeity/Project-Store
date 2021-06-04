import * as Sequelize from 'sequelize';
import { RoleInstance } from 'diploma';
import SequelizeInstance from '../config/SequelizeInstance';

const RoleModel: Sequelize.ModelCtor<RoleInstance> = SequelizeInstance.getSequelizeInstance()
  .define<RoleInstance>('roles', {
    id: {
      allowNull: false,
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV1,
      primaryKey: true,
    },
    roleName: {
      allowNull: false,
      type: Sequelize.STRING(255),
    },
  });

export default RoleModel;
