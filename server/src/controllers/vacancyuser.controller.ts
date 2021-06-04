import * as Sequelize from 'sequelize';
import {
  VacancyDTO,
  VacancyUserAttributes,
  VacancyUserCreationAttributes,
  VacancyUserDTO,
  VacancyUserInstance,
} from 'diploma';
import VacancyUserModel from '../models/VacancyUserModel';
import vacancyController from './vacancy.controller.';
import VacancyModel from '../models/VacancyModel';
import UserModel from '../models/UserModel';
import ProjectModel from '../models/ProjectModel';
import DepartmentModel from '../models/DepartmentModel';
import RoleModel from '../models/RoleModel';

function GetVacancyUserDTOFromVacancyUserInstance(vacancyUserInstance: VacancyUserInstance)
  : VacancyUserDTO {
  const vacancyUser: VacancyUserDTO = vacancyUserInstance.toJSON() as VacancyUserDTO;

  return vacancyUser;
}

async function GetAllByCondition(options: Sequelize.FindOptions<VacancyUserAttributes>)
  : Promise<VacancyUserDTO[]> {
  const vacancyUserInstances: VacancyUserInstance[] = await VacancyUserModel
    .findAll({
      ...options,
      include: [{
        model: VacancyModel,
        as: 'vacancy',
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
      }, {
        model: UserModel,
        as: 'user',
        include: [{
          model: DepartmentModel,
          as: 'department',
        }, {
          model: RoleModel,
          as: 'role',
        }],
      }],
    });

  const result: VacancyUserDTO[] = vacancyUserInstances.map(
    (vacancyUserInstance: VacancyUserInstance) => (
      GetVacancyUserDTOFromVacancyUserInstance(vacancyUserInstance)
    ),
  );

  return result;
}

async function Create(vacancyUser: VacancyUserCreationAttributes): Promise<VacancyUserDTO | null> {
  const { vacancyId } = vacancyUser;

  const vacancy: VacancyDTO | null = await vacancyController
    .GetOneByCondition({
      where: {
        id: vacancyId,
      },
    });

  if (vacancy) {
    vacancy.currentNumber += 1;

    if (vacancy.currentNumber <= vacancy.number) {
      const vacancyUserInstance: VacancyUserInstance = await VacancyUserModel
        .create(vacancyUser);

      vacancyController.Update(vacancy);

      const result: VacancyUserDTO[] = await GetAllByCondition({
        where: {
          userId: vacancyUserInstance.userId,
          vacancyId: vacancyUserInstance.vacancyId,
        },
      });

      return result[0];
    }
  }

  return null;
}

async function Delete(vacancyId: string, userId: string): Promise<boolean> {
  const result = await VacancyUserModel.destroy({
    where: {
      vacancyId,
      userId,
    },
  });

  return Boolean(result);
}

export default {
  GetAllByCondition,
  Create,
  Delete,
};
