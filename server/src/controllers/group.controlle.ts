import * as Sequelize from 'sequelize';
import {
  GroupAttributes,
  GroupCreationAttributes,
} from 'diploma';
import GroupModel from '../models/GroupModel';

async function GetOneByCondition(options: Sequelize.FindOptions<GroupAttributes>):
Promise<GroupAttributes | null> {
  const result: GroupAttributes | null = await GroupModel.findOne(options) as GroupAttributes;

  return result;
}

async function Create(group: GroupCreationAttributes): Promise<GroupAttributes> {
  const result: GroupAttributes = await GroupModel.create(group) as GroupAttributes;

  return result;
}

async function Update(group: GroupCreationAttributes): Promise<GroupAttributes | null> {
  const result: [number, GroupAttributes[]] = await GroupModel.update(group, {
    where: { id: group.id },
    returning: true,
  }) as [number, GroupAttributes[]];

  return result[1][0];
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
