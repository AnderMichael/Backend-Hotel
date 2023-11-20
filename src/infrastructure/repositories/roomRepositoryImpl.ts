import { RoomRepository } from "../../domain/interfaces/roomRepository";
import { Room } from "../../domain/models/room";
import { AppDataSource } from "../config/dataSource";
import logger from "../logger/logger";
import { RoomEntity } from "../entities/roomEntity";

export class RoomRepositoryImpl implements RoomRepository {
  async findById(id: string): Promise<Room | null> {
    try {
      logger.info(`Finding room by ID: ${id} in RoomRepositoryImpl`);
      const roomRepository = AppDataSource.getRepository(RoomEntity);
      const room = await roomRepository.findOne({
        where: { id },
        relations: ["hotel"],
      });
      return room ? new Room(room) : null;
    } catch (error) {
      logger.error(
        `Error finding room by ID ${id} in RoomRepositoryImpl:`,
        error
      );
      throw new Error("Internal Server Error");
    }
  }

  async createRoom(room: Room): Promise<Room> {
    try {
      logger.info("Creating room in RoomRepositoryImpl");
      const roomRepository = AppDataSource.getRepository(RoomEntity);

      const roomEntity = roomRepository.create({
        id: room.id,
        number: room.number,
        available: room.available,
        price: room.price,
        hotel: room.hotel,
        capacity: room.capacity,
        category: room.category,
        createdAt: room.createdAt,
        modifiedAt: room.modifiedAt,
      });

      const roomResponse = await roomRepository.save(roomEntity);

      return new Room({
        id: roomResponse.id,
        available: roomResponse.available,
        number: roomResponse.number,
        price: roomResponse.price,
        hotel: roomResponse.hotel,
        capacity: roomResponse.capacity,
        category: roomResponse.category,
        createdAt: roomResponse.createdAt,
        modifiedAt: roomResponse.modifiedAt,
      });
    } catch (error) {
      logger.error("Error creating room in RoomRepositoryImpl:", error);
      throw new Error("Internal Server Error");
    }
  }

  async deleteRoom(id: string): Promise<void> {
    try {
      logger.debug(
        `Attempting to delete room with ID: ${id} in RoomRepositoryImpl`
      );
      const repository = AppDataSource.getRepository(RoomEntity);
      const room = await repository.findOneBy({ id });

      if (!room) {
        logger.error(
          `Error deleting room with ID ${id} in RoomRepositoryImpl: Room not found`
        );
        throw new Error("Room not found");
      }

      await repository.remove(room);
      logger.info(
        `Room with ID: ${id} deleted successfully in RoomRepositoryImpl`
      );
    } catch (error) {
      logger.error(
        `Error deleting room with ID ${id} in RoomRepositoryImpl:`,
        error
      );
      throw new Error("Internal Server Error");
    }
  }

  async updateRoom(id: string, updateData: Partial<Room>): Promise<Room> {
    try {
      logger.debug(
        `Attempting to update room with ID: ${id} in RoomRepositoryImpl`
      );
      const repository = AppDataSource.getRepository(RoomEntity);
      const room = await repository.findOneBy({ id });

      if (!room) {
        logger.error(
          `Error updating room with ID ${id} in RoomRepositoryImpl: Room not found`
        );
        throw new Error("Room not found");
      }

      repository.merge(room, updateData);
      const updatedRoom = await repository.save(room);
      logger.info(
        `Room with ID: ${id} updated successfully in RoomRepositoryImpl`
      );
      return updatedRoom;
    } catch (error) {
      logger.error(
        `Error updating room with ID ${id} in RoomRepositoryImpl:`,
        error
      );
      throw new Error("Internal Server Error");
    }
  }
}
