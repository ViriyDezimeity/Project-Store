import * as Sequelize from 'sequelize';
import {
  DepartmentAttributes,
  DepartmentCreationAttributes,
  DepartmentDTO,
  DepartmentInstance,
} from 'diploma';
import DepartmentModel from '../models/DepartmentModel';

function GetDepartmentDTOFromDepartmentInstance(departmentInstance: DepartmentInstance)
  : DepartmentDTO {
  const department: DepartmentDTO = departmentInstance.toJSON() as DepartmentDTO;

  return department;
}

async function GetAll(): Promise<DepartmentDTO[] | null> {
  const departmentInstances: DepartmentInstance[] = await DepartmentModel
    .findAll();

  const result: DepartmentDTO[] = departmentInstances.map(
    (departmentInstance: DepartmentInstance) => (
      GetDepartmentDTOFromDepartmentInstance(departmentInstance)
    ),
  );

  return result;
}

async function GetOneByCondition(options: Sequelize.FindOptions<DepartmentAttributes>)
  : Promise<DepartmentDTO | null> {
  const departmentInstance: DepartmentInstance | null = await DepartmentModel
    .findOne(options);

  if (!departmentInstance) {
    return null;
  }

  const result: DepartmentDTO = GetDepartmentDTOFromDepartmentInstance(departmentInstance);

  return result;
}

async function Create(department: DepartmentCreationAttributes): Promise<DepartmentDTO> {
  const departmentInstance: DepartmentInstance = await DepartmentModel
    .create(department);

  const result: DepartmentDTO = GetDepartmentDTOFromDepartmentInstance(departmentInstance);

  return result;
}

async function Update(department: DepartmentCreationAttributes)
  : Promise<DepartmentDTO | null> {
  const updateResult: [number, DepartmentInstance[]] = await DepartmentModel
    .update(department, {
      where: { id: department.id },
      returning: true,
    });

  if (!updateResult[1][0]) {
    return null;
  }

  const result: DepartmentDTO = GetDepartmentDTOFromDepartmentInstance(updateResult[1][0]);

  return result;
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
