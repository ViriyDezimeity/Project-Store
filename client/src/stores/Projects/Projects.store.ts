import { ProjectCreationAttributes } from "diploma";
import { makeAutoObservable } from "mobx";
import { axiosFetchFunction, axiosPostFunction } from "../../helpers/axiosInstance";
import { ProjectCreatedResponse, ProjectResponse } from "./Projects.interface";

export class ProjectsStore {
  public state: 'loading' | 'loaded' | 'error' = 'loading';

  public projects: ProjectResponse[] | null = null;

  constructor() {
    makeAutoObservable(this);
    this.fetchAllProjects();
  }

  private fetchAllProjects = async (): Promise<void> => {
    try {
      const projects: ProjectResponse[] = await axiosFetchFunction<ProjectResponse[]>('/projects');

      this.projects = projects;
      this.state = 'loaded';
    } catch {
      this.state = 'error';
    }
  }

  public createProject = async (project: ProjectCreationAttributes): Promise<void> => {
    try {
      const result: ProjectCreatedResponse = await axiosPostFunction('/projects', project);

      this.projects?.push(result.project);
    } catch {
      this.state = 'error';
    }
  }
}