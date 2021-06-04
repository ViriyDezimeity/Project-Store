import * as Sequelize from 'sequelize';
import {
  UserAttributes,
  UserCreationAttributes,
  UserDTO,
  UserInstance,
  VacancyAttributes,
  VacancyDTO,
  VacancyUserAttributes,
} from 'diploma';
import UserModel from '../models/UserModel';
import VacancyUserController from './vacancyuser.controller';
import VacancyController from './vacancy.controller.';
import DepartmentModel from '../models/DepartmentModel';
import RoleModel from '../models/RoleModel';

function GetUserDTOFromUserInstance(userInstance: UserInstance): UserDTO {
  const user: UserDTO = userInstance.toJSON() as UserDTO;

  return user;
}

async function GetOneByCondition(options: Sequelize.FindOptions<UserAttributes>)
  : Promise<UserDTO | null> {
  const userInstance: UserInstance | null = await UserModel.findOne({
    ...options,
    include: [{
      model: DepartmentModel,
      as: 'department',
    }, {
      model: RoleModel,
      as: 'role',
    }],
  });

  if (!userInstance) {
    return null;
  }

  const result: UserDTO = GetUserDTOFromUserInstance(userInstance);

  return result;
}

const GetTeamByProjectId = async (projectId: string): Promise<UserDTO[]> => {
  const vacancies: VacancyDTO[] = await VacancyController.GetAllByCondition({
    where: {
      projectId,
    },
  });

  const team: UserDTO[] = [];

  await Promise.all(vacancies.map(async (vacancy: VacancyAttributes) => {
    const vacanciesUsers: VacancyUserAttributes[] = await VacancyUserController.GetAllByCondition({
      where: {
        vacancyId: vacancy.id,
      },
    });

    await Promise.all(vacanciesUsers.map(async (vacancyUser: VacancyUserAttributes) => {
      const user: UserDTO | null = await GetOneByCondition({
        where: {
          id: vacancyUser.userId,
        },
      });

      if (user && team.includes(user)) {
        return;
      }

      if (user) {
        team.push(user);
      }
    }));
  }));

  return team;
};

async function Create(user: UserCreationAttributes): Promise<UserAttributes> {
  const result: UserAttributes = await UserModel.create(user) as UserAttributes;

  return result;
}

async function Update(user: UserCreationAttributes): Promise<UserAttributes | null> {
  const result: [number, UserAttributes[]] = await UserModel.update(user, {
    where: { id: user.id },
    returning: true,
  }) as [number, UserAttributes[]];

  return result[1][0];
}

async function DeleteById(id: string): Promise<boolean> {
  const result = await UserModel.destroy({
    where: {
      id,
    },
  });

  return Boolean(result);
}

export default {
  GetOneByCondition,
  GetTeamByProjectId,
  Create,
  Update,
  DeleteById,
};
