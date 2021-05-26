import * as Sequelize from 'sequelize';
import {
  VacancyAttributes,
  VacancyCreationAttributes,
} from 'diploma';
import VacancyModel from '../models/VacancyModel';

async function GetAllByCondition(options: Sequelize.FindOptions<VacancyAttributes>):
Promise<VacancyAttributes[]> {
  const result: VacancyAttributes[] | null = await VacancyModel.findAll(options) as VacancyAttributes[];

  return result;
}

async function GetOneByCondition(options: Sequelize.FindOptions<VacancyAttributes>):
Promise<VacancyAttributes | null> {
  const result: VacancyAttributes | null = await VacancyModel.findOne(options) as VacancyAttributes;

  return result;
}

async function Create(vacancy: VacancyCreationAttributes): Promise<VacancyAttributes> {
  const result: VacancyAttributes = await VacancyModel.create(vacancy) as VacancyAttributes;

  return result;
}

async function Update(vacancy: VacancyCreationAttributes): Promise<VacancyAttributes | null> {
  const result: [number, VacancyAttributes[]] = await VacancyModel.update(vacancy, {
    where: { id: vacancy.id },
    returning: true,
  }) as [number, VacancyAttributes[]];

  return result[1][0];
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
