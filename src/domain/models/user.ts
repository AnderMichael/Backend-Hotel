import { v4 as uuidv4 } from "uuid";
import { IUserEntity } from "../entities/IUserEntity";
import { token } from "morgan";
import {RoleEntity} from "../../infrastructure/entities/roleEntity";
import {IRoleEntity} from "../entities/IRoleEntity";

export class User {
  id: string;
  username: string;
  email: string;
  hashedPassword: string;
  lastLogin: Date | null;
  createdAt: Date;
  modifiedAt: Date;
  token?: string | null;
  role?: IRoleEntity;

  constructor(userEntity: Partial<IUserEntity>) {
    this.id = userEntity.id || uuidv4();
    this.username = userEntity.username;
    this.email = userEntity.email;
    this.hashedPassword = userEntity.hashedPassword;
    this.lastLogin = userEntity.lastLogin;
    this.createdAt = userEntity.createdAt;
    this.modifiedAt = userEntity.modifiedAt;
    this.role = userEntity.role;
  }
}
