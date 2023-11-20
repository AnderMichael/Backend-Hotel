import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";
import { IHotelEntity } from "../../domain/entities/IHotelEntity";

@Entity()
export class HotelEntity implements IHotelEntity {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ type: "varchar" })
  name!: string;

  @Column({ type: "int" }) // Assuming roomsTotal and roomsAvailable should be integers
  roomsTotal!: number;

  @Column({ type: "int" })
  roomsAvailable!: number;

  @Column({ type: "varchar" })
  location!: string;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  createdAt!: Date;

  @Column({ type: "timestamp"})
  modifiedAt!: Date;

}
