import * as Sequelize from 'sequelize';
import { ProjectDTO } from './project';

export interface VacancyAttributes {
  id: string;
  projectId: string;
  role: string;
  number: string;
  currentNumber: string;
  requirements: string;
}

export interface VacancyCreationAttributes
  extends Sequelize.Optional<VacancyAttributes, 'id' | 'projectId' | 'number' | 'currentNumber' | 'requirements'> {}

export interface VacancyInstance
  extends Sequelize.Model<VacancyAttributes, VacancyCreationAttributes>,
  VacancyAttributes {}

export interface VacancyDTO extends VacancyAttributes {
  project: ProjectDTO;
}
