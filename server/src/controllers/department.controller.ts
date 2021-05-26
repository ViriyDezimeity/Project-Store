import * as Sequelize from 'sequelize';
import {
  DepartmentAttributes,
  DepartmentCreationAttributes,
} from 'diploma';
import DepartmentModel from '../models/DepartmentModel';

async function GetAll():
Promise<DepartmentAttributes[] | null> {
  const result: DepartmentAttributes[] | null = await DepartmentModel
    .findAll() as DepartmentAttributes[];

  return result;
}

async function GetOneByCondition(options: Sequelize.FindOptions<DepartmentAttributes>):
Promise<DepartmentAttributes | null> {
  const result: DepartmentAttributes | null = await DepartmentModel
    .findOne(options) as DepartmentAttributes;

  return result;
}

async function Create(department: DepartmentCreationAttributes): Promise<DepartmentAttributes> {
  const result: DepartmentAttributes = await DepartmentModel
    .create(department) as DepartmentAttributes;

  return result;
}

async function Update(department: DepartmentCreationAttributes):
Promise<DepartmentAttributes | null> {
  const result: [number, DepartmentAttributes[]] = await DepartmentModel
    .update(department, {
      where: { id: department.id },
      returning: true,
    }) as [number, DepartmentAttributes[]];

  return result[1][0];
}

async function DeleteById(id: string): Promise<boolean> {
  const result = await DepartmentModel.destroy({
    where: {
      id,
    },
  });

  return Boolean(result);
}

export default {
  GetAll,
  GetOneByCondition,
  Create,
  Update,
  DeleteById,
};
