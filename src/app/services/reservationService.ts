import { IReservationEntity } from "../../domain/entities/IReservationEntity";
import { ReservationRepository } from "../../domain/interfaces/reservationRepository";
import { Reservation } from "../../domain/models/reservation";
import { ReservationDTO } from "../dtos/reservation.dto";
import { CreateReservationDTO } from "../dtos/create.reservation.dto";
import logger from "../../infrastructure/logger/logger";
import { User } from "../../domain/models/user";
import { UserRepository } from "../../domain/interfaces/userRepository";
import { Room } from "../../domain/models/room";
import { RoomRepository } from "../../domain/interfaces/roomRepository";

export class ReservationService {
  constructor(
    private reservationRepository: ReservationRepository,
    private userRepository: UserRepository,
    private roomRepository: RoomRepository
  ) {}

  async createReservation(
    reservationDTO: CreateReservationDTO
  ): Promise<Reservation> {
    const user: User = await this.userRepository.findById(
      reservationDTO.userId
    );

    const room: Room = await this.roomRepository.findById(
      reservationDTO.roomId
    );

    try {
      const reservationEntity: Partial<IReservationEntity> = {
        user: user,
        room: room,
        status: "Remaining",
        reservationInit: reservationDTO.reservationInit,
        reservationEnd: reservationDTO.reservationEnd,
        payment: reservationDTO.payment,
        createdAt: new Date(),
        modifiedAt: new Date(),
      };

      const newReservation = new Reservation(reservationEntity);
      const createdReservation =
        await this.reservationRepository.createReservation(newReservation);

      logger.info(
        `Reservation created successfully in ReservationService: ${createdReservation.id}`
      );
      return createdReservation;
    } catch (error) {
      logger.error("Error creating reservation in ReservationService:", error);
      throw new Error("Internal Server Error");
    }
  }

  async getReservationById(
    reservationId: string
  ): Promise<ReservationDTO | null> {
    try {
      const reservation = await this.reservationRepository.findById(
        reservationId
      );
      if (!reservation) {
        return reservation;
      }

      // Map properties from reservation to reservationDTO
      const reservationResponse: ReservationDTO = {
        user: reservation.user,
        room: reservation.room,
        reservationInit: reservation.reservationInit,
        reservationEnd: reservation.reservationEnd,
        payment: reservation.payment,
        status: reservation.status,
        createdAt: reservation.createdAt,
        modifiedAt: reservation.modifiedAt,
      };

      logger.info(
        `Reservation retrieved successfully in ReservationService: ${reservation.id}`
      );
      return reservationResponse;
    } catch (error) {
      logger.error(
        `Error getting reservation by ID ${reservationId} in ReservationService:`,
        error
      );
      throw new Error("Internal Server Error");
    }
  }

  async updateReservationById(
    id: string,
    updatedData: Partial<ReservationDTO>
  ): Promise<ReservationDTO | null> {
    try {
      logger.debug(
        `Attempting to update reservation with ID: ${id} in ReservationService`
      );
      const reservation = await this.reservationRepository.updateReservation(
        id,
        updatedData
      );
      if (!reservation) {
        return reservation;
      }

      // Map properties from reservation to reservationDTO
      const reservationResponse: ReservationDTO = {
        user: reservation.user,
        room: reservation.room,
        reservationInit: reservation.reservationInit,
        reservationEnd: reservation.reservationEnd,
        payment: reservation.payment,
        status: reservation.status,
        createdAt: reservation.createdAt,
        modifiedAt: reservation.modifiedAt,
      };

      logger.info(
        `Reservation with ID: ${id} updated successfully in ReservationService`
      );
      return reservationResponse;
    } catch (error) {
      logger.error(
        `Error updating reservation with ID ${id} in ReservationService:`,
        error
      );
      throw new Error("Internal Server Error");
    }
  }

  async deleteReservationById(id: string): Promise<void> {
    try {
      logger.debug(
        `Attempting to delete reservation with ID: ${id} in ReservationService`
      );
      await this.reservationRepository.deleteReservation(id);
      logger.info(
        `Reservation with ID: ${id} deleted successfully in ReservationService`
      );
    } catch (error) {
      logger.error(
        `Error deleting reservation with ID ${id} in ReservationService:`,
        error
      );
      throw new Error("Internal Server Error");
    }
  }
}
