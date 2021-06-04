import axios, { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { ErrorResponse } from 'diploma';
import { HttpStatusCode } from '../enums';

export interface IResponse<T> {
  status: HttpStatusCode;
  data: T;
}

export const axiosInstance: AxiosInstance = axios.create({
  baseURL: `http://localhost:5000/api`,
});

const handleResponse = <T>(response: AxiosResponse<T>): IResponse<T> => {
  return {
    status: response.status,
    data: response.data,
  };
};

const handleErrorResponse = (error: AxiosError<ErrorResponse>): ErrorResponse => {
  if (error.response) {
    return error.response.data;
  }
  
  return {
    status: HttpStatusCode.BAD_REQUEST,
    message: 'Unknown Error',
  }
}

export const axiosFetchFunction = async <T>(
  url: string,
  requestConfig?: AxiosRequestConfig
): Promise<IResponse<T> | ErrorResponse> => {
  const response: IResponse<T> | ErrorResponse = await axiosInstance.get(
    url,
    requestConfig
  )
  .then((data: AxiosResponse<T>): IResponse<T> => {
    return handleResponse<T>(data);
  })
  .catch((error: AxiosError): ErrorResponse => {
    return handleErrorResponse(error);
  });

  return response;
};

export const axiosPostFunction = async <T>(
  url: string,
  data?: any,
  requestConfig?: AxiosRequestConfig
): Promise<IResponse<T> | ErrorResponse> => {
  const response: IResponse<T> | ErrorResponse = await axiosInstance.post(url, data, {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    ...requestConfig,
  })
  .then((data: AxiosResponse<T>): IResponse<T> => {
    return handleResponse<T>(data);
  })
  .catch((error: AxiosError): ErrorResponse => {
    return handleErrorResponse(error);
  });

  return response;
};

export const axiosUpdateFunction = async <T>(
  url: string,
  data?: any,
  requestConfig?: AxiosRequestConfig
): Promise<IResponse<T> | ErrorResponse> => {
  const response: IResponse<T> | ErrorResponse = await axiosInstance.put(url, data, {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    ...requestConfig,
  })
  .then((data: AxiosResponse<T>): IResponse<T> => {
    return handleResponse<T>(data);
  })
  .catch((error: AxiosError): ErrorResponse => {
    return handleErrorResponse(error);
  });

  return response;
};

export const axiosDeleteFunction = async <T>(
  url: string,
  id: string,
  requestConfig?: AxiosRequestConfig
): Promise<IResponse<T> | ErrorResponse> => {
  const response: IResponse<T> | ErrorResponse = await axiosInstance.delete(`${url}/${id}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    ...requestConfig,
  })
  .then((data: AxiosResponse<T>): IResponse<T> => {
    return handleResponse<T>(data);
  })
  .catch((error: AxiosError): ErrorResponse => {
    return handleErrorResponse(error);
  });

  return response;
};