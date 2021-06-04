import { makeAutoObservable } from 'mobx';
import {
  axiosFetchFunction,
  axiosPostFunction,
  IResponse,
} from '../../helpers/axiosInstance';
import { UserData, IUserResponse } from './Authentication.interfaces';
import { ErrorResponse, UserCreationAttributes } from 'diploma'
import { HttpStatusCode } from '../../enums';

export class AuthenticationStore {
  public state: 'loading' | 'loaded' | 'error' = 'loading';

  private errorMessage: string | null = null;

  public userData?: UserData;

  public isUserAuthorized = false;

  constructor() {
    makeAutoObservable(this);
    this.fetchUserInfo();
  }

  public register = async (newUser: UserCreationAttributes): Promise<void> => {
    try {
      const response: IResponse<IUserResponse> | ErrorResponse = await axiosPostFunction('/registration', newUser);

      if (response.status !== HttpStatusCode.OK) {
        this.setErrorMessage((response as ErrorResponse).message);
        return;
      }
      
      const { user, token } = (response as IResponse<IUserResponse>).data;

      this.setAuthState(user, token);      
      this.state = 'loaded';
    } catch (error) {
      this.setErrorState();
    }
  }

  public login = async (email: string, password: string): Promise<void> => {
    try {
      const response: IResponse<IUserResponse> | ErrorResponse = await axiosPostFunction('/login', {
        mail: email,
        password,
      });

      if (response.status !== HttpStatusCode.OK) {
        this.setErrorMessage((response as ErrorResponse).message);
        return;
      }

      const { user, token } = (response as IResponse<IUserResponse>).data;

      this.setAuthState(user, token);
      this.state = 'loaded';
    } catch (error) {
      this.setErrorState();
    }
  };

  public logout = (): void => {
    this.resetAuthState();
  };

  public setErrorMessage = (message: string | null): void => {
    this.errorMessage = message;
  }

  public getErrorMessage = (): string | null => {
    const errorMessage: string | null = this.errorMessage;
    this.setErrorMessage(null);
    return errorMessage;
  }

  private fetchUserInfo = async (): Promise<void> => {
    try {
      const token: string | null = localStorage.getItem('token');
      if (token !== null) {
        const response: IResponse<IUserResponse> | ErrorResponse = await axiosFetchFunction<IUserResponse>(
          '/auth',
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          }
        );

        if (response.status !== HttpStatusCode.OK) {
          this.setErrorMessage((response as ErrorResponse).message);
        }

        if (response.status === HttpStatusCode.UNAUTHORIZED) {
          this.resetAuthState();
          this.state = 'loaded';
          return;
        }

        const { user, token } = (response as IResponse<IUserResponse>).data;

        this.setAuthState(user, token);
      }
      this.state = 'loaded';
    } catch (error) {
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
    this.setErrorMessage(null);
    this.userData = undefined;
    this.isUserAuthorized = false;
    localStorage.removeItem('token');
  }
}
