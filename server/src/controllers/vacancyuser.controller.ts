import * as Sequelize from 'sequelize';
import {
  VacancyUserAttributes,
  VacancyUserCreationAttributes,
} from 'diploma';
import VacancyUserModel from '../models/VacancyUserModel';

async function GetAllByCondition(options: Sequelize.FindOptions<VacancyUserAttributes>):
Promise<VacancyUserAttributes[]> {
  const result: VacancyUserAttributes[] = await VacancyUserModel
    .findAll(options) as VacancyUserAttributes[];

  return result;
}

async function Create(vacancyUser: VacancyUserCreationAttributes): Promise<VacancyUserAttributes> {
  const result: VacancyUserAttributes = await VacancyUserModel
    .create(vacancyUser) as VacancyUserAttributes;

  return result;
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
