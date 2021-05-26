import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { HttpStatusCode } from '../enums';

class HttpError extends Error {
  httpStatus?: HttpStatusCode;

  constructor(message?: string, httpStatus?: HttpStatusCode) {
    super(message);
    this.httpStatus = httpStatus;
  }
}

export const axiosInstance: AxiosInstance = axios.create({
  baseURL: `http://localhost:5000/api`,
});

const handleResponse = async <T>(response: AxiosResponse<T>): Promise<T> => {
  if (response.status === HttpStatusCode.OK) {
    return response.data as T;
  } else {
    throw new HttpError(
      `Response: [${response.status}] ${response.statusText}`,
      response.status
    );
  }
};

export const axiosFetchFunction = async <T>(
  url: string,
  requestConfig?: AxiosRequestConfig
): Promise<T> => {
  const response: AxiosResponse<T> = await axiosInstance.get(
    url,
    requestConfig
  );

  return handleResponse<T>(response);
};

export const axiosPostFunction = async <T>(
  url: string,
  data?: any,
  requestConfig?: AxiosRequestConfig
): Promise<T> => {
  const response: AxiosResponse<T> = await axiosInstance.post(url, data, {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    ...requestConfig,
  });

  return handleResponse<T>(response);
};

export const axiosUpdateFunction = async <T>(
  url: string,
  data?: any,
  requestConfig?: AxiosRequestConfig
): Promise<T> => {
  const reponse: AxiosResponse<T> = await axiosInstance.put(url, data, {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    ...requestConfig,
  });

  return handleResponse<T>(reponse);
};

export const axiosDeleteFunction = async <T>(
  url: string,
  id: string,
  requestConfig?: AxiosRequestConfig
): Promise<T> => {
  const reponse: AxiosResponse<T> = await axiosInstance.delete(`${url}/${id}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    ...requestConfig,
  });
  return handleResponse<T>(reponse);
};