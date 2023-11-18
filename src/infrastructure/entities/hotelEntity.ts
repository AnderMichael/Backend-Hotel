import {Column, Entity, JoinColumn, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import {IHotelEntity} from "../../domain/entities/IHotelEntity";
@Entity()
export class HotelEntity implements IHotelEntity {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column({ type: 'number' })
    name!: string;

    @Column({ type: 'number'})
    roomsTotal!: number;
    @Column({ type: 'number' })
    roomsAvailable!: number;

    @Column({ type: 'string' })
    location!: string;

    @Column({ type: 'timestamp' })
    createdAt!: Date;


}