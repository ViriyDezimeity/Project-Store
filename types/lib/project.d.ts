import * as Sequelize from 'sequelize';
import { UserDTO } from './user';

export interface ProjectAttributes {
  id: string;
  title: string;
  description: string;
  customer: string;
  dateBegin: Date;
  dateEnd: Date;
  controlPoints: string;
  result: string;
  managerId: string;
}

export interface ProjectCreationAttributes
  extends Sequelize.Optional<ProjectAttributes, 'id' | 'controlPoints' | 'result' | 'managerId'> {}

export interface ProjectInstance
  extends Sequelize.Model<ProjectAttributes, ProjectCreationAttributes>,
    ProjectAttributes {}

export interface ProjectDTO extends ProjectAttributes {
  manager: UserDTO;
  team: UserDTO[];
}
