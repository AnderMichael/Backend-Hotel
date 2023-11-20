import { IRoomEntity } from "./IRoomEntity";
import { IUserEntity } from "./IUserEntity";

export interface IReservationEntity {
  id?: string;
  user: IUserEntity;
  room: IRoomEntity;
  status: "Aproved" | "Denied" | "Remaining";
  payment: number;
  reservationInit: Date;
  reservationEnd: Date;
  createdAt: Date;
  modifiedAt: Date;
}
