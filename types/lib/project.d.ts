import * as Sequelize from 'sequelize';

export interface ProjectAttributes {
  id: string;
  title: string;
  description: string;
  customer: string;
  dateBegin: Date;
  dateEnd: Date;
  controlPoints: string;
  result: string;
  manager: string;
}

export interface ProjectCreationAttributes
  extends Sequelize.Optional<ProjectAttributes, 'id' | 'controlPoints' | 'result'> {}

export interface ProjectInstance
  extends Sequelize.Model<ProjectAttributes, ProjectCreationAttributes>,
    ProjectAttributes {}
