import { v4 as uuidv4 } from "uuid";
import { IUserEntity } from "../entities/IUserEntity";
import { token } from "morgan";

export class User {
  id: string;
  username: string;
  email: string;
  hashedPassword: string;
  lastLogin: Date | null;
  token: string | null;

  constructor(userEntity: IUserEntity) {
    this.id = userEntity.id || uuidv4();
    this.username = userEntity.username;
    this.email = userEntity.email;
    this.hashedPassword = userEntity.hashedPassword;
    this.lastLogin = userEntity.lastLogin;
    this.token = userEntity.token;
  }
}
