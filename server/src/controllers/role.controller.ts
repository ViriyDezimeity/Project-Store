import * as Sequelize from 'sequelize';
import {
  RoleAttributes,
  RoleCreationAttributes,
  RoleDTO,
  RoleInstance,
} from 'diploma';
import RoleModel from '../models/RoleModel';

function GetRoleDTOFromRoleInstance(roleInstance: RoleInstance): RoleDTO {
  const role: RoleDTO = roleInstance.toJSON() as RoleDTO;

  return role;
}

async function GetOneByCondition(options: Sequelize.FindOptions<RoleAttributes>)
  : Promise<RoleDTO | null> {
  const roleInstance: RoleInstance | null = await RoleModel.findOne(options);

  if (!roleInstance) {
    return null;
  }

  const result: RoleDTO = GetRoleDTOFromRoleInstance(roleInstance);

  return result;
}

async function Create(role: RoleCreationAttributes): Promise<RoleDTO> {
  const roleInstance: RoleInstance = await RoleModel.create(role);

  const result: RoleDTO = GetRoleDTOFromRoleInstance(roleInstance);

  return result;
}

async function Update(role: RoleCreationAttributes): Promise<RoleDTO | null> {
  const updateResult: [number, RoleInstance[]] = await RoleModel.update(role, {
    where: { id: role.id },
    returning: true,
  });

  if (!updateResult[1][0]) {
    return null;
  }

  const result: RoleDTO = GetRoleDTOFromRoleInstance(updateResult[1][0]);

  return result;
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
