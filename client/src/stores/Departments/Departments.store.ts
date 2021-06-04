import { makeAutoObservable } from 'mobx';
import {
  axiosFetchFunction, IResponse,
} from '../../helpers/axiosInstance';
import { DepartmentAttributes, ErrorResponse } from 'diploma'
import { HttpStatusCode } from '../../enums';

export class DepartmentsStore {
  public state: 'loading' | 'loaded' | 'error' = 'loading';

  private errorMessage: string | null = null;

  public departments: DepartmentAttributes[] | null = null;

  constructor() {
    makeAutoObservable(this);
    this.fetchDepartments();
  }

  public setErrorMessage = (message: string | null): void => {
    this.errorMessage = message;
  }

  public getErrorMessage = (): string | null => {
    const errorMessage: string | null = this.errorMessage;
    this.setErrorMessage(null);
    return errorMessage;
  }

  private fetchDepartments = async (): Promise<void> => {
    try {
      const response: IResponse<DepartmentAttributes[]> | ErrorResponse = await axiosFetchFunction<DepartmentAttributes[]>('/departments');

      if (response.status !== HttpStatusCode.OK) {
        this.setErrorMessage((response as ErrorResponse).message);
        return;
      }

      this.departments = (response as IResponse<DepartmentAttributes[]>).data;
      this.state = 'loaded';
    } catch (error) {
      console.error(error);
    }
  };
}
