import * as Sequelize from 'sequelize';

export interface VacancyAttributes {
  id: string;
  projectId: string;
  role: string;
  number: number;
  requirements: string;
}

export interface VacancyCreationAttributes
  extends Sequelize.Optional<VacancyAttributes, 'requirements'> {}

export interface VacancyInstance
  extends Sequelize.Model<VacancyAttributes, VacancyCreationAttributes>,
  VacancyAttributes {}
