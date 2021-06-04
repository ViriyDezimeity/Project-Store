import * as Sequelize from 'sequelize';
import {
  GroupAttributes,
  GroupCreationAttributes,
  GroupDTO,
  GroupInstance,
} from 'diploma';
import GroupModel from '../models/GroupModel';
import DepartmentModel from '../models/DepartmentModel';

function GetGroupDTOFromGroupInstance(groupInstance: GroupInstance): GroupDTO {
  const group: GroupDTO = groupInstance.toJSON() as GroupDTO;

  return group;
}

async function GetOneByCondition(options: Sequelize.FindOptions<GroupAttributes>)
  : Promise<GroupDTO | null> {
  const groupIntance: GroupInstance | null = await GroupModel.findOne({
    ...options,
    include: [{
      model: DepartmentModel,
      as: 'department',
    }],
  });

  if (!groupIntance) {
    return null;
  }

  const result: GroupDTO = GetGroupDTOFromGroupInstance(groupIntance);

  return result;
}

async function Create(group: GroupCreationAttributes): Promise<GroupDTO> {
  const groupInstance: GroupInstance = await GroupModel.create(group, {
    include: [{
      model: DepartmentModel,
      as: 'department',
    }],
  });

  const result: GroupDTO = GetGroupDTOFromGroupInstance(groupInstance);

  return result;
}

async function Update(group: GroupCreationAttributes): Promise<GroupDTO | null> {
  const updateResult: [number, GroupInstance[]] = await GroupModel.update(group, {
    where: { id: group.id },
    returning: true,
  });

  if (!updateResult[1][0]) {
    return null;
  }

  const result: GroupDTO = GetGroupDTOFromGroupInstance(updateResult[1][0]);

  return result;
}

async function DeleteById(id: string): Promise<boolean> {
  const result = await GroupModel.destroy({
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
