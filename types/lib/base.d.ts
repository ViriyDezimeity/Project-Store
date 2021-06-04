import { HttpStatusCode } from "./statuses";

export interface ErrorResponse {
  status: HttpStatusCode;
  message: string;
}
