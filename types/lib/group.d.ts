import * as Sequelize from 'sequelize';

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
