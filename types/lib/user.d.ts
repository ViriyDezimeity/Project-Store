import * as Sequelize from 'sequelize';

export interface UserAttributes {
  id: string;
  firstName: string;
  lastName: string;
  patronymic: string;
  dateBirth: Date;
  placeWork: string;
  phoneNumber: string;
  mail: string;
  login: string;
  password: string;
  aboutMe: string;
  departmentId: string;
  roleId: string;
}

export interface UserCreationAttributes
  extends Sequelize.Optional<UserAttributes, 'id' | 'patronymic' | 'dateBirth' | 'placeWork' | 'aboutMe' | 'roleId'> {}

export interface UserInstance
  extends Sequelize.Model<UserAttributes, UserCreationAttributes>,
    UserAttributes {}
