import * as Sequelize from 'sequelize';
import {
  ProjectAttributes,
  ProjectCreationAttributes,
  ProjectDTO,
  ProjectInstance,
} from 'diploma';
import ProjectModel from '../models/ProjectModel';
import UserController from './user.controller';
import UserModel from '../models/UserModel';
import DepartmentModel from '../models/DepartmentModel';
import RoleModel from '../models/RoleModel';

async function GetProjectDTOFromProjectInstance(projectInstance: ProjectInstance)
  : Promise<ProjectDTO> {
  const project: ProjectDTO = projectInstance.toJSON() as ProjectDTO;

  return {
    id: project.id,
    title: project.title,
    description: project.description,
    customer: project.customer,
    dateBegin: project.dateBegin,
    dateEnd: project.dateEnd,
    controlPoints: project.controlPoints,
    result: project.result,
    managerId: project.managerId,
    manager: project.manager,
    team: await UserController.GetTeamByProjectId(project.id),
  };
}

async function GetAll(options?: Sequelize.FindOptions<ProjectAttributes>): Promise<ProjectDTO[]> {
  const projects: ProjectInstance[] = await ProjectModel.findAll({
    ...options,
    include: [{
      model: UserModel,
      as: 'manager',
      include: [{
        model: DepartmentModel,
        as: 'department',
      }, {
        model: RoleModel,
        as: 'role',
      }],
    }],
    order: [
      ['createdAt', 'ASC'],
    ],
  });

  const resultProjects: ProjectDTO[] = await Promise.all(
    projects.map(async (project: ProjectInstance) => GetProjectDTOFromProjectInstance(project)),
  );

  return resultProjects;
}

async function GetOneByCondition(options: Sequelize.FindOptions<ProjectAttributes>)
  : Promise<ProjectDTO | null> {
  const projectInstance: ProjectInstance | null = await ProjectModel.findOne({
    ...options,
    include: [{
      model: UserModel,
      as: 'manager',
      include: [{
        model: DepartmentModel,
        as: 'department',
      }, {
        model: RoleModel,
        as: 'role',
      }],
    }],
  });

  if (!projectInstance) {
    return null;
  }

  const project: ProjectDTO = await GetProjectDTOFromProjectInstance(projectInstance);

  return project;
}

async function Create(project: ProjectCreationAttributes): Promise<ProjectDTO | null> {
  const createResult: ProjectInstance = await ProjectModel.create(project);

  const result: ProjectDTO | null = await GetOneByCondition({
    where: {
      id: createResult.id,
    },
  });

  return result;
}

async function Update(project: ProjectCreationAttributes): Promise<ProjectDTO | null> {
  const updateResult: [number, ProjectInstance[]] = await ProjectModel.update(project, {
    where: { id: project.id },
    returning: true,
  });

  if (!updateResult[1][0]) {
    return null;
  }

  const result: ProjectDTO | null = await GetOneByCondition({
    where: {
      id: updateResult[1][0].id,
    },
  });

  return result;
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
