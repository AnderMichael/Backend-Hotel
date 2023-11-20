import { IRoomEntity } from "../../domain/entities/IRoomEntity";
import { IUserEntity } from "../../domain/entities/IUserEntity";
import { APPROVED, DENIED, REMAINING } from "../utils/constants";

export interface ReservationDTO {
  id?: string;
  user: IUserEntity;
  room: IRoomEntity;
  reservationInit: Date;
  reservationEnd: Date;
  payment: number;
  status: typeof APPROVED | typeof DENIED | typeof REMAINING;
  createdAt?: Date;
  modifiedAt?: Date;
}
