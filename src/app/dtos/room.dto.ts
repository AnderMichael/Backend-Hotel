import { HotelDto } from "./hotel.dto";
import { ReservationDTO } from "./reservation.dto";

export interface RoomDto {
  id?: string;
  number: number;
  category: string;
  available: boolean;
  capacity: number;
  price: number;
  hotel: Partial<HotelDto>;
  reservations: Partial<ReservationDTO>[];
}
