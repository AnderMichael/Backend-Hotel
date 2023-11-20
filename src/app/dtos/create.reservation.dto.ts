export interface CreateReservationDTO {
  userId: string;
  roomId: string;
  payment: number;
  reservationInit: Date;
  reservationEnd: Date;
}
