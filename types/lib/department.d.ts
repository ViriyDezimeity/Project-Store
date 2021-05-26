import * as Sequelize from 'sequelize';

export interface DepartmentAttributes {
  id: string;
  departmentName: string;
}

export interface DepartmentCreationAttributes
  extends Sequelize.Optional<DepartmentAttributes, 'id'> {}

export interface DepartmentInstance
  extends Sequelize.Model<DepartmentAttributes, DepartmentCreationAttributes>,
    DepartmentAttributes {}
