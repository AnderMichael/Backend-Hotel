import {IHotelEntity} from "./IHotelEntity";
export interface IRoomEntity {
    id: string;
    number: number;
    category: string;
    available: boolean;
    capacity: number;
    createdAt: Date;
    hotel: IHotelEntity;
    price: number;
}