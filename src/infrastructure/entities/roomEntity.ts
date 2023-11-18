import {Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany} from "typeorm";
import { IRoomEntity } from '../../domain/entities/IRoomEntity';
import {HotelEntity} from "./hotelEntity";
@Entity()
export class RoomEntity implements IRoomEntity {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column({ type: 'number' })
    number: number;

    @Column({ type: 'varchar'})
    category: string;
    @Column({ type: 'number' })
    capacity!: number;

    @Column({ type: 'boolean' })
    available: boolean;

    @Column({ type: 'timestamp' })
    createdAt!: Date;
    @OneToMany(() => HotelEntity)
    @JoinColumn({ name: 'hotelId' })
    hotel: HotelEntity;

    @Column({ type: 'number' })
    price: number;


}