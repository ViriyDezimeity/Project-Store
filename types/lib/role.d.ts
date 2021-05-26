import * as Sequelize from 'sequelize';

export interface RoleAttributes {
  id: string;
  roleName: string;
}

export interface RoleCreationAttributes
  extends Sequelize.Optional<RoleAttributes, 'id'> {}

export interface RoleInstance
  extends Sequelize.Model<RoleAttributes, RoleCreationAttributes>,
    RoleAttributes {}
