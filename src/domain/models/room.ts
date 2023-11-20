import { IRoomEntity } from "../entities/IRoomEntity";
import { v4 as uuidv4 } from "uuid";
import { IHotelEntity } from "../entities/IHotelEntity";

export class Room {
  id: string;
  number: number;
  category: string;
  available: boolean;
  capacity: number;
  createdAt: Date;
  modifiedAt: Date;
  hotel: IHotelEntity;
  price: number;

  constructor(roomEntity: Partial<IRoomEntity>) {
    this.id = roomEntity.id || uuidv4();
    this.number = roomEntity.number;
    this.available = roomEntity.available;
    this.capacity = roomEntity.capacity;
    this.category = roomEntity.category;
    this.price = roomEntity.price;
    this.hotel = roomEntity.hotel;
    this.createdAt = roomEntity.createdAt;
    this.modifiedAt = roomEntity.modifiedAt;
  }
}
