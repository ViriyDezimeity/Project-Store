import * as Sequelize from 'sequelize';
import { UserDTO } from './user';
import { VacancyDTO } from './vacancy';

export interface VacancyUserAttributes {
  vacancyId: string;
  userId: string;
}

export interface VacancyUserCreationAttributes
  extends VacancyUserAttributes {}

export interface VacancyUserInstance
  extends Sequelize.Model<VacancyUserAttributes, VacancyUserCreationAttributes>,
    VacancyUserAttributes {}

export interface VacancyUserDTO extends VacancyUserAttributes {
  vacancy: VacancyDTO;
  user: UserDTO;
}