import { Reservation } from "../models/reservation";
import { Room } from "../models/room";
import { User } from "../models/user";

export interface ReservationRepository {
    findAll(): Promise<Reservation[]>;
    findByUser(user: User): Promise<Reservation[]> ;
    findByRoom(room: Room): Promise<Reservation[]> ;
    findById(id: string): Promise<Reservation | null>;
    createReservation(reservation: Reservation): Promise<Reservation>;
    deleteReservation(id: string): Promise<void>;
    updateReservation(reservationId: string, updateData: Partial<Reservation>): Promise<Reservation>;
}
