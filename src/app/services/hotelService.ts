import { HotelRepository } from "../../domain/interfaces/hotelRepository";
import { HotelDto } from "../dtos/hotel.dto";
import { Hotel } from "../../domain/models/hotel";
import { IHotelEntity } from "../../domain/entities/IHotelEntity";
import logger from "../../infrastructure/logger/logger";
import { CreateHotelDTO } from "../dtos/create.hotel.dto";

export class HotelService {
  constructor(private hotelRepository: HotelRepository) {}

  async getHotelById(id: string): Promise<HotelDto | null> {
    try {
      const hotel = await this.hotelRepository.findById(id);

      if (!hotel) {
        logger.info(`Hotel with ID ${id} not found in HotelService`);
        return null;
      }

      const hotelResponse: HotelDto = {
        id: hotel.id,
        name: hotel.name,
        location: hotel.location,
        roomsAvailable: hotel.roomsAvailable,
        roomsTotal: hotel.roomsTotal,
      };

      logger.info(`Hotel with ID ${id} retrieved successfully in HotelService`);
      return hotelResponse;
    } catch (error) {
      logger.error(`Error getting hotel by ID ${id} in HotelService: ${error}`);
      throw error;
    }
  }

  async createHotel(hotelDto: CreateHotelDTO): Promise<Hotel> {
    try {
      const hotelEntity: IHotelEntity = {
        createdAt: new Date(),
        modifiedAt: new Date(),
        location: hotelDto.location,
        name: hotelDto.name,
        roomsAvailable: 0,
        roomsTotal: 0,
      };
      const newHotel = new Hotel(hotelEntity);

      const createdHotel = await this.hotelRepository.createHotel(newHotel);

      logger.info(`Hotel created successfully in HotelService: ${createdHotel.id}`);
      return createdHotel;
    } catch (error) {
      logger.error(`Error creating hotel in HotelService: ${error}`);
      throw error;
    }
  }

  async deleteHotel(hotelId: string): Promise<void> {
    try {
      logger.debug(`HotelService: Attempting to delete hotel with ID: ${hotelId}`);
      await this.hotelRepository.deleteHotel(hotelId);
      logger.info(`Hotel with ID: ${hotelId} deleted successfully in HotelService`);
    } catch (error) {
      logger.error(`Error deleting hotel with ID ${hotelId} in HotelService: ${error}`);
      throw error;
    }
  }

  async updateHotel(
    hotelId: string,
    updateData: Partial<CreateHotelDTO>
  ): Promise<Hotel> {
    try {
      logger.debug(`HotelService: Attempting to update hotel with ID: ${hotelId}`);
      const updatedHotel = await this.hotelRepository.updateHotel(hotelId, updateData);
      logger.info(`Hotel with ID: ${hotelId} updated successfully in HotelService`);
      return updatedHotel;
    } catch (error) {
      logger.error(`Error updating hotel with ID ${hotelId} in HotelService: ${error}`);
      throw error;
    }
  }
}