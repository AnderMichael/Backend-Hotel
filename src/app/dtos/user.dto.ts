import { ReservationDTO } from "./reservation.dto";

export interface UserDTO {
  id?: string;
  username: string;
  email: string;
  createdAt: Date;
  modifiedAt: Date;
  lastLogin: Date | null;
  token?: string;
  reservations?: Partial<ReservationDTO>[];
}
