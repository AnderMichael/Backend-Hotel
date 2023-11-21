import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { UserEntity } from "./userEntity";
import { RoomEntity } from "./roomEntity";
import { IReservationEntity } from "../../domain/entities/IReservationEntity";

@Entity()
export class ReservationEntity implements IReservationEntity {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @ManyToOne(() => UserEntity, (user) => user.reservations)
  @JoinColumn({ name: "userId" })
  user: UserEntity;

  @ManyToOne(() => RoomEntity, (room) => room.reservations)
  @JoinColumn({ name: "roomId" })
  room: RoomEntity;

  @Column({ type: "varchar" })
  status!: "Aproved" | "Denied" | "Pending";

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  reservationInit!: Date;

  @Column({ type: "timestamp" })
  reservationEnd!: Date;

  @Column({ type: "decimal", precision: 10, scale: 2 }) // Adjust precision and scale based on your requirements
  payment!: number;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  createdAt!: Date;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  modifiedAt!: Date;
}
