import {IHotelEntity} from "../entities/IHotelEntity";
import { v4 as uuidv4 } from 'uuid';

export class Hotel {
    id: string;
    name: string;
    roomsTotal: number;
    roomsAvailable: number;
    location: string;
    createdAt:Date;

    constructor(hotelEntity: IHotelEntity) {
        this.id = hotelEntity.id || uuidv4();
        this.name = hotelEntity.name;
        this.roomsTotal = hotelEntity.roomsTotal;
        this.roomsAvailable = hotelEntity.roomsAvailable;
        this.location = hotelEntity.location;
        this.createdAt = hotelEntity.createdAt || new Date();
    }

}