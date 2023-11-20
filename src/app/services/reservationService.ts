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
import { REMAINING } from "../utils/constants";
import { RoomDto } from "../dtos/room.dto";
import { UserDTO } from "../dtos/user.dto";

export class ReservationService {
  constructor(
    private reservationRepository: ReservationRepository,
    private userRepository: UserRepository,
    private roomRepository: RoomRepository
  ) {}

  async getReservationsRoom(roomId: string): Promise<Partial<RoomDto> | null> {
    const room: Room = await this.roomRepository.findById(roomId);

    const reservations: Reservation[] =
      await this.reservationRepository.findByRoom(room);

    const roomDto: Partial<RoomDto> = {
      number: room.number,
      capacity: room.capacity,
      category: room.category,
      price: room.price,
      hotel: room.hotel,
      reservations: reservations.map((reservation) =>
        this.extractDataForRooms(reservation)
      ),
    };
    return roomDto;
  }

  async getReservationsUser(userId: string): Promise<Partial<UserDTO> | null> {
    const user: User = await this.userRepository.findById(userId);

    const reservations: Reservation[] =
      await this.reservationRepository.findByUser(user);

    const userDto: Partial<UserDTO> = {
      username: user.username,
      email: user.email,
      lastLogin: user.lastLogin,
      reservations: reservations.map((reservation) =>
        this.extractDataForUsers(reservation)
      ),
    };
    return userDto;
  }

  async getRemainingReservationsRoom(
    roomId: string
  ): Promise<Partial<RoomDto> | null> {
    try {
      const room: Room = await this.roomRepository.findById(roomId);

      const reservations: Reservation[] =
        await this.reservationRepository.findByRoom(room);

      const remainingReservations =
        this.filterRemainingReservationsbyRoom(reservations);

      const roomDto: Partial<RoomDto> = {
        number: room.number,
        capacity: room.capacity,
        category: room.category,
        price: room.price,
        hotel: room.hotel,
        reservations: remainingReservations,
      };

      logger.debug(
        `Remaining reservations retrieved for room with ID ${roomId}:`,
        roomDto.reservations
      );

      return roomDto;
    } catch (error) {
      logger.error(
        `Error getting remaining reservations for room with ID ${roomId}:`,
        error
      );
      return null;
    }
  }

  async getRemainingReservationsUser(
    userId: string
  ): Promise<Partial<UserDTO> | null> {
    try {
      logger.info(
        `Getting remaining reservations for user with ID ${userId} in ReservationService`
      );
      const user: User = await this.userRepository.findById(userId);

      const reservations: Reservation[] =
        await this.reservationRepository.findByUser(user);

      const remainingReservations =
        this.filterRemainingReservationsbyUser(reservations);

      const userDto: Partial<UserDTO> = {
        username: user.username,
        email: user.email,
        lastLogin: user.lastLogin,
        reservations: remainingReservations,
      };

      logger.debug(
        `Remaining reservations retrieved for user with ID ${userId} in ReservationService:`,
        userDto.reservations
      );

      return userDto;
    } catch (error) {
      logger.error(
        `Error getting remaining reservations for user with ID ${userId} in ReservationService:`,
        error
      );
      throw new Error("Internal Server Error");
    }
  }

  private filterRemainingReservationsbyUser(
    reservations: Reservation[]
  ): Partial<Reservation>[] {
    return reservations
      .filter((reservation) => reservation.status === REMAINING)
      .map((reservation) => this.extractDataForUsers(reservation));
  }

  private extractDataForUsers(reservation: Reservation): Partial<Reservation> {
    return {
      user: reservation.user,
      reservationInit: reservation.reservationInit,
      reservationEnd: reservation.reservationEnd,
      payment: reservation.payment,
      status: reservation.status,
    };
  }

  private filterRemainingReservationsbyRoom(
    reservations: Reservation[]
  ): Partial<Reservation>[] {
    return reservations
      .filter((reservation) => reservation.status === REMAINING)
      .map((reservation) => this.extractDataForRooms(reservation));
  }

  private extractDataForRooms(reservation: Reservation): Partial<Reservation> {
    return {
      room: reservation.room,
      reservationInit: reservation.reservationInit,
      reservationEnd: reservation.reservationEnd,
      payment: reservation.payment,
      status: reservation.status,
    };
  }

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
        status: REMAINING,
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
