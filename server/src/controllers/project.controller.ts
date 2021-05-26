import * as Sequelize from 'sequelize';
import {
  ProjectAttributes,
  ProjectCreationAttributes,
} from 'diploma';
import ProjectModel from '../models/ProjectModel';

async function GetAll(): Promise<ProjectAttributes[]> {
  const result: ProjectAttributes[] = await ProjectModel.findAll();

  return result;
}

async function GetOneByCondition(options: Sequelize.FindOptions<ProjectAttributes>):
Promise<ProjectAttributes | null> {
  const result: ProjectAttributes | null = await ProjectModel.findOne(options) as ProjectAttributes;

  return result;
}

async function Create(project: ProjectCreationAttributes): Promise<ProjectAttributes> {
  const result: ProjectAttributes = await ProjectModel.create(project) as ProjectAttributes;

  return result;
}

async function Update(project: ProjectCreationAttributes): Promise<ProjectAttributes | null> {
  const result: [number, ProjectAttributes[]] = await ProjectModel.update(project, {
    where: { id: project.id },
    returning: true,
  }) as [number, ProjectAttributes[]];

  return result[1][0];
}

async function DeleteById(id: string): Promise<boolean> {
  const result = await ProjectModel.destroy({
    where: {
      id,
    },
  });

  return Boolean(result);
}

export default {
  GetAll,
  GetOneByCondition,
  Create,
  Update,
  DeleteById,
};
