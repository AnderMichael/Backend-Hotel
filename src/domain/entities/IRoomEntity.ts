import { IHotelEntity } from "./IHotelEntity";
import { IReservationEntity } from "./IReservationEntity";
export interface IRoomEntity {
  id?: string;
  number: number;
  category: string;
  available: boolean;
  capacity: number;
  createdAt: Date;
  modifiedAt: Date;
  hotel: IHotelEntity;
  price: number;
  reservations?: IReservationEntity[];
}
