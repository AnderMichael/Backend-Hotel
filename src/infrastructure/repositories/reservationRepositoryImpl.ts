import { ReservationRepository } from "../../domain/interfaces/reservationRepository";
import { Reservation } from "../../domain/models/reservation";
import { AppDataSource } from "../config/dataSource";
import { ReservationEntity } from "../entities/reservationEntity";
import logger from "../logger/logger"; // Add this import

export class ReservationRepositoryImpl implements ReservationRepository {
  async findAll(): Promise<Reservation[]> {
    try {
      logger.info("Finding all reservations in ReservationRepositoryImpl");
      const reservationRepository =
        AppDataSource.getRepository(ReservationEntity);
      const reservations = await reservationRepository.find();
      return reservations.map((reservation) => new Reservation(reservation));
    } catch (error) {
      logger.error(
        "Error finding all reservations in ReservationRepositoryImpl:",
        error
      );
      throw new Error("Internal Server Error");
    }
  }

  async findById(id: string): Promise<Reservation | null> {
    try {
      logger.info(
        `Finding reservation by ID: ${id} in ReservationRepositoryImpl`
      );
      const reservationRepository =
        AppDataSource.getRepository(ReservationEntity);
      const reservation = await reservationRepository.findOne({
        where: { id },
      });
      return reservation ? new Reservation(reservation) : null;
    } catch (error) {
      logger.error(
        `Error finding reservation by ID ${id} in ReservationRepositoryImpl:`,
        error
      );
      throw new Error("Internal Server Error");
    }
  }

  async createReservation(reservation: Reservation): Promise<Reservation> {
    try {
      logger.info("Creating reservation in ReservationRepositoryImpl");
      const reservationRepository =
        AppDataSource.getRepository(ReservationEntity);

      const reservationEntity = reservationRepository.create({
        id: reservation.id,
        user: reservation.user,
        room: reservation.room,
        payment: reservation.payment,
        status: reservation.status,
        reservationInit: reservation.reservationInit,
        reservationEnd: reservation.reservationEnd,
        createdAt: reservation.createdAt,
        modifiedAt: reservation.modifiedAt,
      });

      const reservationResponse = await reservationRepository.save(
        reservationEntity
      );

      return new Reservation({
        id: reservationResponse.id,
        user: reservationResponse.user,
        room: reservationResponse.room,
        payment: reservationResponse.payment,
        status: reservationResponse.status,
        reservationInit: reservationResponse.reservationInit,
        reservationEnd: reservationResponse.reservationEnd,
        createdAt: reservationResponse.createdAt,
        modifiedAt: reservationResponse.modifiedAt,
      });
    } catch (error) {
      logger.error(
        "Error creating reservation in ReservationRepositoryImpl:",
        error
      );
      throw new Error("Internal Server Error");
    }
  }

  async deleteReservation(id: string): Promise<void> {
    try {
      logger.debug(
        `Attempting to delete reservation with ID: ${id} in ReservationRepositoryImpl`
      );
      const repository = AppDataSource.getRepository(ReservationEntity);
      const reservation = await repository.findOne({ where: { id } });

      if (!reservation) {
        logger.error(
          `Error deleting reservation with ID ${id} in ReservationRepositoryImpl: Reservation not found`
        );
        throw new Error("Reservation not found");
      }

      await repository.remove(reservation);
      logger.info(
        `Reservation with ID: ${id} deleted successfully in ReservationRepositoryImpl`
      );
    } catch (error) {
      logger.error(
        `Error deleting reservation with ID ${id} in ReservationRepositoryImpl:`,
        error
      );
      throw new Error("Internal Server Error");
    }
  }

  async updateReservation(
    reservationId: string,
    updateData: Partial<Reservation>
  ): Promise<Reservation> {
    try {
      logger.debug(
        `Attempting to update reservation with ID: ${reservationId} in ReservationRepositoryImpl`
      );
      const repository = AppDataSource.getRepository(ReservationEntity);
      const reservation = await repository.findOne({
        where: { id: reservationId },
      });

      if (!reservation) {
        logger.error(
          `Error updating reservation with ID ${reservationId} in ReservationRepositoryImpl: Reservation not found`
        );
        throw new Error("Reservation not found");
      }

      updateData.modifiedAt = new Date();
      repository.merge(reservation, updateData);
      const updatedReservation = await repository.save(reservation);
      logger.info(
        `Reservation with ID: ${reservationId} updated successfully in ReservationRepositoryImpl`
      );
      return updatedReservation;
    } catch (error) {
      logger.error(
        `Error updating reservation with ID ${reservationId} in ReservationRepositoryImpl:`,
        error
      );
      throw new Error("Internal Server Error");
    }
  }
}
