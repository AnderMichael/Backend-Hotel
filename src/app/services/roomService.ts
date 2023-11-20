import { RoomDto } from "../dtos/room.dto";
import { IRoomEntity } from "../../domain/entities/IRoomEntity";
import { CreateRoomDTO } from "../dtos/create.room.dto";
import logger from "../../infrastructure/logger/logger";
import { Room } from "../../domain/models/room";
import { RoomRepository } from "../../domain/interfaces/roomRepository";
import { HotelRepository } from "../../domain/interfaces/hotelRepository";
import { Hotel } from "../../domain/models/hotel";

export class RoomService {
  constructor(
    private roomRepository: RoomRepository,
    private hotelRepository: HotelRepository
  ) {}

  async getRoomById(id: string): Promise<RoomDto | null> {
    try {
      const room = await this.roomRepository.findById(id);
      if (!room) return null;

      const roomResponse: RoomDto = {
        available: room.available,
        capacity: room.capacity,
        category: room.category,
        number: room.number,
        price: room.price,
        hotel: {
          name: room.hotel.name,
          roomsTotal: room.hotel.roomsTotal,
          location: room.hotel.location,
        },
      };
      logger.info("Room obtained successfully in RoomService");
      return roomResponse;
    } catch (error) {
      logger.error(`Error getting room by ID ${id}. Error: ${error} in RoomService`);
      throw new Error("Internal Server Error");
    }
  }

  async createRoom(roomDto: CreateRoomDTO): Promise<Room> {
    try {
      const hotel: Hotel = await this.hotelRepository.findById(roomDto.hotelId);
      if (!hotel) {
        throw new Error("Hotel not found");
      }
      hotel.roomsAvailable += 1;
      hotel.roomsTotal += 1;
      await this.hotelRepository.updateHotel(hotel.id, hotel);

      const roomEntity: IRoomEntity = {
        available: roomDto.available,
        capacity: roomDto.capacity,
        category: roomDto.category,
        createdAt: new Date(),
        modifiedAt: new Date(),
        hotel: hotel,
        number: roomDto.number,
        price: roomDto.price,
      };
      const newRoom = new Room(roomEntity);

      const createdRoom = await this.roomRepository.createRoom(newRoom);
      logger.info(`Room created successfully: ${createdRoom.id} in RoomService`);
      return createdRoom;
    } catch (error) {
      logger.error(`Error creating room. Error: ${error} in RoomService`);
      throw new Error("Internal Server Error");
    }
  }

  async deleteRoom(roomId: string): Promise<void> {
    try {
      logger.debug(`Attempting to delete room with ID: ${roomId} in RoomService`);
      const { hotel }: Room = await this.roomRepository.findById(roomId);
      hotel.roomsAvailable -= 1;
      hotel.roomsTotal -= 1;
      hotel.modifiedAt = new Date();
      await this.hotelRepository.updateHotel(hotel.id, hotel);
      await this.roomRepository.deleteRoom(roomId);
      logger.info(`Room with ID: ${roomId} deleted successfully in RoomService`);
    } catch (error) {
      logger.error(`Error deleting room with ID ${roomId}. Error: ${error} in RoomService`);
      throw new Error("Internal Server Error");
    }
  }

  async updateRoom(roomId: string, updateData: Partial<CreateRoomDTO>): Promise<Room> {
    try {
      logger.debug(`Attempting to update room with ID: ${roomId} in RoomService`);
      const updatedRoom = await this.roomRepository.updateRoom(roomId, updateData);
      logger.info(`Room with ID: ${roomId} updated successfully in RoomService`);
      return updatedRoom;
    } catch (error) {
      logger.error(`Error updating room with ID ${roomId}. Error: ${error} in RoomService`);
      throw new Error("Internal Server Error");
    }
  }
}
