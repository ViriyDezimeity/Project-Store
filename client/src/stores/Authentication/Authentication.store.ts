import { makeAutoObservable } from 'mobx';
import { HttpStatusCode } from '../../enums';
import {
  axiosFetchFunction,
  axiosPostFunction,
} from '../../helpers/axiosInstance';
import { UserData, IUserResponse } from './Authentication.interfaces';
import { UserCreationAttributes } from 'diploma'

export class AuthenticationStore {
  public state: 'loading' | 'loaded' | 'error' = 'loading';

  public userData?: UserData;

  public isUserAuthorized = false;

  constructor() {
    makeAutoObservable(this);
    this.fetchUserInfo();
  }

  public register = async (user: UserCreationAttributes): Promise<void> => {
    try {
      const response: IUserResponse = await axiosPostFunction('/registration', user);
      this.setAuthState(response.user, response.token);      

      this.state = 'loaded';
    } catch (error) {
      this.setErrorState();
    }
  }

  public login = async (email: string, password: string): Promise<void> => {
    try {
      const response: IUserResponse = await axiosPostFunction('/login', {
        mail: email,
        password,
      });
      this.setAuthState(response.user, response.token);

      this.state = 'loaded';
    } catch (error) {
      this.setErrorState();
    }
  };

  public logout = (): void => {
    this.resetAuthState();
  };

  private fetchUserInfo = async (): Promise<void> => {
    try {
      const token: string | null = localStorage.getItem('token');
      if (token !== null) {
        const response: IUserResponse = await axiosFetchFunction<IUserResponse>(
          '/auth',
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          }
        );
        this.setAuthState(response.user, response.token);
      }

      this.state = 'loaded';
    } catch (error) {
      if (error.httpStatus === HttpStatusCode.UNAUTHORIZED) {
        this.resetAuthState();
        this.state = 'loaded';
        return;
      }

      console.error(
        'An unexpected error has occurred during loading user data.'
      );
      this.setErrorState();
    }
  };

  private setErrorState(): void {
    this.resetAuthState();
    this.state = 'error';
  }

  private setAuthState(user: UserData, token: string): void {
    this.userData = user;
    this.isUserAuthorized = true;
    localStorage.setItem('token', token);
  }

  private resetAuthState(): void {
    this.userData = undefined;
    this.isUserAuthorized = false;
    localStorage.removeItem('token');
  }
}
