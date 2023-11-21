import { IReservationEntity } from "./IReservationEntity";
import {IRoleEntity} from "./IRoleEntity";

export interface IUserEntity {
  id?: string;
  username: string;
  email: string;
  hashedPassword: string;
  createdAt: Date;
  modifiedAt: Date;
  lastLogin: Date | null;
  reservations?: IReservationEntity[];
  role?: IRoleEntity;
}
