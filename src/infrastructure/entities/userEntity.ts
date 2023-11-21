import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne } from "typeorm";
import { IUserEntity } from "../../domain/entities/IUserEntity";
import { ReservationEntity } from "./reservationEntity";
import {RoleEntity} from "./roleEntity";

@Entity()
export class UserEntity implements IUserEntity {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ type: "varchar" })
  username!: string;

  @Column({ type: "varchar", unique: true })
  email!: string;

  @Column({ type: "varchar" })
  hashedPassword!: string;

  @Column({ type: "timestamp", nullable: true })
  lastLogin!: Date | null;

  @Column({ type: "timestamp" })
  createdAt!: Date;

  @Column({ type: "timestamp" })
  modifiedAt!: Date;

  @OneToMany(() => ReservationEntity, (reservation) => reservation.room)
  reservations: ReservationEntity[];
  @ManyToOne(()=> RoleEntity,(role)=>role.id)
  role: RoleEntity;
}
