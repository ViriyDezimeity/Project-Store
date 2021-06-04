import { ErrorResponse, ProjectCreationAttributes, ProjectDTO } from "diploma";
import { makeAutoObservable } from "mobx";
import { HttpStatusCode } from "../../enums";
import { IResponse, axiosFetchFunction, axiosPostFunction } from "../../helpers/axiosInstance";

export class ProjectsStore {
  public state: 'loading' | 'loaded' | 'error' = 'loading';

  private errorMessage: string | null = null;

  public projects: ProjectDTO[] | null = null;

  constructor() {
    makeAutoObservable(this);
    this.fetchAllProjects();
  }

  public setErrorMessage = (message: string | null): void => {
    this.errorMessage = message;
  }

  public getErrorMessage = (): string | null => {
    const errorMessage: string | null = this.errorMessage;
    this.setErrorMessage(null);
    return errorMessage;
  }

  public createProject = async (project: ProjectCreationAttributes) => {
    try {
      const response: IResponse<ProjectDTO> | ErrorResponse = await axiosPostFunction('/projects', project);
      
      if (response.status !== HttpStatusCode.OK) {
        this.setErrorMessage((response as ErrorResponse).message);
        return;
      }
      
      this.projects?.push((response as IResponse<ProjectDTO>).data);
    } catch {
      this.state = 'error';
    }
  }

  private fetchAllProjects = async (): Promise<void> => {
    try {
      const response: IResponse<ProjectDTO[]> | ErrorResponse = await axiosFetchFunction<ProjectDTO[]>('/projects');

      if (response.status !== HttpStatusCode.OK) {
        this.setErrorMessage((response as ErrorResponse).message);
        return;
      }
      
      this.projects = (response as IResponse<ProjectDTO[]>).data;
      this.state = 'loaded';
    } catch {
      this.state = 'error';
    }
  }

}