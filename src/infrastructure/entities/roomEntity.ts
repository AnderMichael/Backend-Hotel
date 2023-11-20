import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from "typeorm";
import { IRoomEntity } from "../../domain/entities/IRoomEntity";
import { HotelEntity } from "./hotelEntity";
import { IHotelEntity } from "../../domain/entities/IHotelEntity";

@Entity()
export class RoomEntity implements IRoomEntity {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ type: "int" }) // Assuming number should be an integer
  number: number;

  @Column({ type: "varchar" })
  category: string;

  @Column({ type: "int" }) // Assuming capacity should be an integer
  capacity!: number;

  @Column({ type: "boolean", default: true })
  available!: boolean;

  @ManyToOne(() => HotelEntity)
  @JoinColumn({ name: "hotelId" })
  hotel!: HotelEntity;

  @Column({ type: "decimal", precision: 10, scale: 2 }) // Adjust precision and scale based on your requirements
  price!: number;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  createdAt!: Date;
  
  @Column({ type: "timestamp" })
  modifiedAt: Date;
}
