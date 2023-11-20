import { Reservation } from "../models/reservation";

export interface ReservationRepository {
    findAll(): Promise<Reservation[]>;
    findById(id: string): Promise<Reservation | null>;
    createReservation(reservation: Reservation): Promise<Reservation>;
    deleteReservation(id: string): Promise<void>;
    updateReservation(reservationId: string, updateData: Partial<Reservation>): Promise<Reservation>;
}
