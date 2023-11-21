import { APPROVED, DENIED, PENDING } from "../../app/utils/constants";
import { IRoomEntity } from "./IRoomEntity";
import { IUserEntity } from "./IUserEntity";

export interface IReservationEntity {
  id?: string;
  user: IUserEntity;
  room: IRoomEntity;
  status: typeof APPROVED | typeof DENIED | typeof PENDING;
  payment: number;
  reservationInit: Date;
  reservationEnd: Date;
  createdAt: Date;
  modifiedAt: Date;
}
