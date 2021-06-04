import { ErrorResponse, ProjectCreationAttributes, ProjectDTO, VacancyCreationAttributes, VacancyDTO, VacancyUserDTO } from "diploma";
import { makeAutoObservable } from "mobx";
import { HttpStatusCode } from "../../enums";
import { axiosDeleteFunction, axiosFetchFunction, axiosPostFunction, axiosUpdateFunction, IResponse } from "../../helpers/axiosInstance";

export class ProjectStore {
  public state: 'loading' | 'loaded' | 'error' = 'loading';
  
  private errorMessage: string | null = null;

  private id: string | null = null;

  public project: ProjectDTO | null = null;

  public projectVacancies: VacancyDTO[] = [];

  constructor() {
    makeAutoObservable(this);
  }

  private fetchData = async (): Promise<void> => {
    try {
      const projectResponse: IResponse<ProjectDTO> | ErrorResponse = await axiosFetchFunction(`/projects/${this.id}`);
      
      if (projectResponse.status !== HttpStatusCode.OK) {
        this.setErrorMessage((projectResponse as ErrorResponse).message);
        this.state = 'loaded';
        return;
      }
      
      this.project = (projectResponse as IResponse<ProjectDTO>).data;

      const projectVacanciesResponse: IResponse<VacancyDTO[]> | ErrorResponse = await axiosFetchFunction(`/projects/${this.id}/vacancies`);
      
      if (projectVacanciesResponse.status !== HttpStatusCode.OK) {
        this.setErrorMessage((projectVacanciesResponse as ErrorResponse).message);
        return;
      }
      
      this.projectVacancies = (projectVacanciesResponse as IResponse<VacancyDTO[]>).data;
      
      this.state = 'loaded';
    } catch {
      this.state = 'error';
    }
  }
  
  public setProjectId = async (id: string): Promise<void> => {
    this.id = id;
    await this.fetchData();
  }

  public getProjectId = (): string | null => {
    return this.id;
  }

  public setErrorMessage = (message: string | null): void => {
    this.errorMessage = message;
  }

  public getErrorMessage = (): string | null => {
    const errorMessage: string | null = this.errorMessage;
    this.setErrorMessage(null);
    return errorMessage;
  }

  public createVacancy = async (vacancy: VacancyCreationAttributes): Promise<void> => {
    try {
      const response: IResponse<VacancyDTO> | ErrorResponse = await axiosPostFunction(`/projects/${this.id}/vacancies`, vacancy);

      if (response.status !== HttpStatusCode.OK) {
        this.setErrorMessage((response as ErrorResponse).message);
        return;
      }

      this.projectVacancies.push((response as IResponse<VacancyDTO>).data);
    } catch {
      this.state = 'error';
    }
  }

  public addUserToProjectVacancy = async (vacancyId: string): Promise<void> => {
    try {
      if (!this.project)
      {
        return;
      }
    
      const response: IResponse<VacancyUserDTO> | ErrorResponse = await axiosPostFunction(
        `/projects/${this.project.id}/vacancies/${vacancyId}/addUser`
      );
      
      if (response.status !== HttpStatusCode.OK) {
        this.setErrorMessage((response as ErrorResponse).message);
        return;
      }
      
      this.project.team.push((response as IResponse<VacancyUserDTO>).data.user);

      this.projectVacancies = this.projectVacancies.map((vacancy: VacancyDTO) => {
        if (vacancy.id === (response as IResponse<VacancyUserDTO>).data.vacancyId) {
          vacancy.currentNumber += 1;
        }

        return vacancy;
      })
    } catch {
      this.state = 'error';
    }
  }

  public updateProject = async (project: ProjectCreationAttributes) => {
    try {
      const response: IResponse<ProjectDTO> | ErrorResponse = await axiosUpdateFunction('/projects', project);
      
      if (response.status !== HttpStatusCode.OK) {
        this.setErrorMessage((response as ErrorResponse).message);
        return;
      }
      
      this.project = (response as IResponse<ProjectDTO>).data;
    } catch {
      this.state = 'error';
    }
  }

  public deleteProject = async (): Promise<boolean> => {
    try {
      if (!this.id) {
        this.setErrorMessage('Непредвиденная ошибка');
        return false;
      }

      const response: IResponse<{}> | ErrorResponse = await axiosDeleteFunction(`/projects/`, this.id);

      if (response.status !== HttpStatusCode.OK) {
        this.setErrorMessage((response as ErrorResponse).message);
        return false;
      }

      return true;
    } catch {
      this.state = 'error';

      return false;
    }
  }
}