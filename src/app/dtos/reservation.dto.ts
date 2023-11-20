import { IRoomEntity } from "../../domain/entities/IRoomEntity";
import { IUserEntity } from "../../domain/entities/IUserEntity";

export interface ReservationDTO {
  id?: string;
  user: IUserEntity;
  room: IRoomEntity;
  reservationInit: Date;
  reservationEnd: Date;
  payment: number;
  status: "Aproved" | "Denied" | "Remaining";
  createdAt: Date;
  modifiedAt: Date;
}
