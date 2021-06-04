import * as Sequelize from 'sequelize';
import { DepartmentDTO } from './department';

export interface GroupAttributes {
  id: string;
  course: string;
  group: string;
  departmentId: string;
}

export interface GroupCreationAttributes
  extends Sequelize.Optional<GroupAttributes, 'id'> {}

export interface GroupInstance
  extends Sequelize.Model<GroupAttributes, GroupCreationAttributes>,
    GroupAttributes {}

export interface GroupDTO extends GroupAttributes {
  department: DepartmentDTO;
}
