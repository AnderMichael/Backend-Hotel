import { ReservationDTO } from "./reservation.dto";
import { RoleDto } from "./role.dto";

export interface UpdateUserDTO {
  id?: string;
  username: string;
  email: string;
  roleId?: string;
}
