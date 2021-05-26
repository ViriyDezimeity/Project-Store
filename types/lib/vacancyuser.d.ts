import * as Sequelize from 'sequelize';

export interface VacancyUserAttributes {
  vacancyId: string;
  userId: string;
}

export interface VacancyUserCreationAttributes
  extends VacancyUserAttributes {}

export interface VacancyUserInstance
  extends Sequelize.Model<VacancyUserAttributes, VacancyUserCreationAttributes>,
    VacancyUserAttributes {}
