import * as Sequelize from 'sequelize';
import {
  RoleAttributes,
  RoleCreationAttributes,
} from 'diploma';
import RoleModel from '../models/RoleModel';

async function GetOneByCondition(options: Sequelize.FindOptions<RoleAttributes>):
Promise<RoleAttributes | null> {
  const result: RoleAttributes | null = await RoleModel.findOne(options) as RoleAttributes;

  return result;
}

async function Create(role: RoleCreationAttributes): Promise<RoleAttributes> {
  const result: RoleAttributes = await RoleModel.create(role) as RoleAttributes;

  return result;
}

async function Update(role: RoleCreationAttributes): Promise<RoleAttributes | null> {
  const result: [number, RoleAttributes[]] = await RoleModel.update(role, {
    where: { id: role.id },
    returning: true,
  }) as [number, RoleAttributes[]];

  return result[1][0];
}

async function DeleteById(id: string): Promise<boolean> {
  const result = await RoleModel.destroy({
    where: {
      id,
    },
  });

  return Boolean(result);
}

export default {
  GetOneByCondition,
  Create,
  Update,
  DeleteById,
};
