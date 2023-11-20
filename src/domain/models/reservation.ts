import { v4 as uuid } from "uuid";
import { IReservationEntity } from "../entities/IReservationEntity";
import { IRoomEntity } from "../entities/IRoomEntity";
import { IUserEntity } from "../entities/IUserEntity";

export class Reservation {
  id: string;
  user: IUserEntity;
  room: IRoomEntity;
  status: "Aproved" | "Denied" | "Remaining";
  payment: number;
  reservationInit: Date;
  reservationEnd: Date;
  createdAt: Date;
  modifiedAt: Date;

  constructor(reservationEntity: Partial<IReservationEntity>) {
    this.id = reservationEntity.id || uuid();
    this.user = reservationEntity.user;
    this.room = reservationEntity.room;
    this.status = reservationEntity.status;
    this.payment = reservationEntity.payment;
    this.reservationInit = reservationEntity.reservationInit;
    this.reservationEnd = reservationEntity.reservationEnd;
    this.createdAt = reservationEntity.createdAt;
    this.modifiedAt = reservationEntity.modifiedAt;
  }
}
