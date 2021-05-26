import { makeAutoObservable } from 'mobx';
import {
  axiosFetchFunction,
} from '../../helpers/axiosInstance';
import { DepartmentAttributes } from 'diploma'

export class DepartmentsStore {
  public state: 'loading' | 'loaded' | 'error' = 'loading';

  public departments: DepartmentAttributes[] | null = null;

  constructor() {
    makeAutoObservable(this);
    this.fetchDepartments();
  }

  private fetchDepartments = async (): Promise<void> => {
    try {
      const response: DepartmentAttributes[] = await axiosFetchFunction<DepartmentAttributes[]>('/departments');

      this.departments = response;
      this.state = 'loaded';
    } catch (error) {
      console.error(error);
    }
  };
}
