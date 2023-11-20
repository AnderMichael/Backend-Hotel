import { HotelRepository } from "../../domain/interfaces/hotelRepository";
import logger from "../logger/logger";
import { Hotel } from "../../domain/models/hotel";
import { AppDataSource } from "../config/dataSource";
import { HotelEntity } from "../entities/hotelEntity";

export class HotelRepositoryImpl implements HotelRepository {
  async findById(id: string): Promise<Hotel | null> {
    try {
      logger.info(`Finding hotel by ID: ${id} in HotelRepositoryImpl`);
      const hotelRepository = AppDataSource.getRepository(HotelEntity);
      const hotel = await hotelRepository.findOne({
        where: { id },
      });
      return hotel ? new Hotel(hotel) : null;
    } catch (error) {
      logger.error(`Error finding hotel by ID ${id} in HotelRepositoryImpl:`, error);
      throw new Error('Internal Server Error');
    }
  }

  async createHotel(hotel: Hotel): Promise<Hotel> {
    try {
      logger.info('Creating hotel in HotelRepositoryImpl');
      const hotelRepository = AppDataSource.getRepository(HotelEntity);

      const hotelEntity = hotelRepository.create({
        id: hotel.id,
        name: hotel.name,
        createdAt: hotel.createdAt,
        modifiedAt: hotel.modifiedAt,
        location: hotel.location,
        roomsAvailable: hotel.roomsAvailable,
        roomsTotal: hotel.roomsTotal,
      });

      const hotelResponse = await hotelRepository.save(hotelEntity);

      return new Hotel({
        id: hotelResponse.id,
        name: hotelResponse.name,
        createdAt: hotelResponse.createdAt,
        location: hotelResponse.location,
        roomsAvailable: hotelResponse.roomsAvailable,
        roomsTotal: hotelResponse.roomsTotal,
      });
    } catch (error) {
      logger.error('Error creating hotel in HotelRepositoryImpl:', error);
      throw new Error('Internal Server Error');
    }
  }

  async deleteHotel(id: string): Promise<void> {
    try {
      logger.debug(`Attempting to delete hotel with ID: ${id} in HotelRepositoryImpl`);
      const repository = AppDataSource.getRepository(HotelEntity);
      const hotel = await repository.findOneBy({ id });

      if (!hotel) {
        logger.error(`Error deleting hotel with ID ${id} in HotelRepositoryImpl: Hotel not found`);
        throw new Error('Hotel not found');
      }

      await repository.remove(hotel);
      logger.info(`Hotel with ID: ${id} deleted successfully in HotelRepositoryImpl`);
    } catch (error) {
      logger.error(`Error deleting hotel with ID ${id} in HotelRepositoryImpl:`, error);
      throw new Error('Internal Server Error');
    }
  }

  async updateHotel(id: string, updateData: Partial<Hotel>): Promise<Hotel> {
    try {
      logger.debug(`Attempting to update hotel with ID: ${id} in HotelRepositoryImpl`);
      const repository = AppDataSource.getRepository(HotelEntity);
      const hotel = await repository.findOneBy({ id });

      if (!hotel) {
        logger.error(`Error updating hotel with ID ${id} in HotelRepositoryImpl: Hotel not found`);
        throw new Error('Hotel not found');
      }

      repository.merge(hotel, updateData);
      const updatedHotel = await repository.save(hotel);
      logger.info(`Hotel with ID: ${id} updated successfully in HotelRepositoryImpl`);
      return updatedHotel;
    } catch (error) {
      logger.error(`Error updating hotel with ID ${id} in HotelRepositoryImpl:`, error);
      throw new Error('Internal Server Error');
    }
  }
}
