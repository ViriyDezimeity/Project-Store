import { UserAttributes } from "diploma";

export interface ProjectResponse {
  id: string;
  title: string;
  description: string;
  customer: string;
  dateBegin: Date;
  dateEnd: Date;
  controlPoints: string;
  result: string;
  manager: UserAttributes | null;
  team: UserAttributes[];
}