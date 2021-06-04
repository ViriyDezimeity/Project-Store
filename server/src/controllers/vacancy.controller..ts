import * as Sequelize from 'sequelize';
import {
  VacancyAttributes,
  VacancyCreationAttributes,
  VacancyDTO,
  VacancyInstance,
} from 'diploma';
import VacancyModel from '../models/VacancyModel';
import ProjectModel from '../models/ProjectModel';
import UserModel from '../models/UserModel';
import DepartmentModel from '../models/DepartmentModel';
import RoleModel from '../models/RoleModel';

function GetVacancyDTOFromVacancyInstance(vacancyInstance: VacancyInstance): VacancyDTO {
  const vacancy: VacancyDTO = vacancyInstance.toJSON() as VacancyDTO;

  return vacancy;
}

async function GetAllByCondition(options: Sequelize.FindOptions<VacancyAttributes>)
  : Promise<VacancyDTO[]> {
  const vacancyInstances: VacancyInstance[] = await VacancyModel.findAll({
    ...options,
    include: [{
      model: ProjectModel,
      as: 'project',
      include: [{
        model: UserModel,
        as: 'manager',
        include: [{
          model: DepartmentModel,
          as: 'department',
        }, {
          model: RoleModel,
          as: 'role',
        }],
      }],
    }],
  });

  const result: VacancyDTO[] = vacancyInstances.map(
    (vacancyInstance: VacancyInstance) => GetVacancyDTOFromVacancyInstance(vacancyInstance),
  );

  return result;
}

async function GetOneByCondition(options: Sequelize.FindOptions<VacancyAttributes>)
  : Promise<VacancyDTO | null> {
  const vacancyInstance: VacancyInstance | null = await VacancyModel.findOne({
    ...options,
    include: [{
      model: ProjectModel,
      as: 'project',
      include: [{
        model: UserModel,
        as: 'manager',
        include: [{
          model: DepartmentModel,
          as: 'department',
        }, {
          model: RoleModel,
          as: 'role',
        }],
      }],
    }],
  });

  if (!vacancyInstance) {
    return null;
  }

  const result: VacancyDTO = GetVacancyDTOFromVacancyInstance(vacancyInstance);

  return result;
}

async function Create(vacancy: VacancyCreationAttributes): Promise<VacancyDTO> {
  const vacancyInstance: VacancyInstance = await VacancyModel.create(vacancy, {
    include: [{
      model: ProjectModel,
      as: 'project',
      include: [{
        model: UserModel,
        as: 'manager',
        include: [{
          model: DepartmentModel,
          as: 'department',
        }, {
          model: RoleModel,
          as: 'role',
        }],
      }],
    }],
  });

  const result: VacancyDTO = GetVacancyDTOFromVacancyInstance(vacancyInstance);

  return result;
}

async function Update(vacancy: VacancyCreationAttributes): Promise<VacancyDTO | null> {
  const updateResult: [number, VacancyInstance[]] = await VacancyModel.update(vacancy, {
    where: { id: vacancy.id },
    returning: true,
  });

  if (!updateResult[1][0]) {
    return null;
  }

  const result: VacancyDTO = GetVacancyDTOFromVacancyInstance(updateResult[1][0]);

  return result;
}

async function DeleteById(id: string): Promise<boolean> {
  const result = await VacancyModel.destroy({
    where: {
      id,
    },
  });

  return Boolean(result);
}

export default {
  GetAllByCondition,
  GetOneByCondition,
  Create,
  Update,
  DeleteById,
};
