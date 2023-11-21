import { IRoomEntity } from "../../domain/entities/IRoomEntity";
import { IUserEntity } from "../../domain/entities/IUserEntity";
import { APPROVED, DENIED, PENDING } from "../utils/constants";

export interface ReservationDTO {
  id?: string;
  user: IUserEntity;
  room: IRoomEntity;
  reservationInit: Date;
  reservationEnd: Date;
  payment: number;
  status: typeof APPROVED | typeof DENIED | typeof PENDING;
  createdAt?: Date;
  modifiedAt?: Date;
}
