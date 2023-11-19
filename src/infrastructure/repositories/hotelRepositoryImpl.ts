import {HotelRepository} from "../../domain/interfaces/hotelRepository";
import logger from "../logger/logger";
import {Hotel} from "../../domain/models/hotel";
import {AppDataSource} from "../config/dataSource";
import {HotelEntity} from "../entities/hotelEntity";

export class HotelRepositoryImpl implements HotelRepository {
    async findById(id: string): Promise<Hotel | null> {
        logger.info('Alguna información relevante');
        const hotelRepository = AppDataSource.getRepository(HotelEntity);
        const hotel = await hotelRepository.findOne({
            where: { id }
        });
        return hotel ? new Hotel(hotel) : null;
    }

    async createHotel(hotel: Hotel): Promise<Hotel> {
        const hotelRepository = AppDataSource.getRepository(HotelEntity);

        const hotelEntity = hotelRepository.create({
            id: hotel.id,
            name: hotel.name,
            createdAt: hotel.createdAt || new Date(),
            location: hotel.location,
            roomsAvailable: hotel.roomsAvailable,
            roomsTotal: hotel.roomsTotal
        });

        const hotelResponse = await hotelRepository.save(hotelEntity);

        return new Hotel({
            id: hotelResponse.id,
            name: hotelResponse.name,
            createdAt: hotelResponse.createdAt,
            location: hotelResponse.location,
            roomsAvailable: hotelResponse.roomsAvailable,
            roomsTotal: hotelResponse.roomsTotal
        });
    }

    async deleteHotel(id: string): Promise<void> {

        const repository = AppDataSource.getRepository(HotelEntity);
        const hotel = await repository.findOneBy({ id });

        if (!hotel) {
            logger.error(`hotelRepository: Error al eliminar al hotel con ID: ${id}.`);
            throw new Error('hotel no encontrado');
        }

        await repository.remove(hotel);
    }

    async updateHotel(id: string, updateData: Partial<Hotel>): Promise<Hotel> {
        const repository = AppDataSource.getRepository(HotelEntity);
        const hotel = await repository.findOneBy({ id });

        if (!hotel) {
            logger.error(`hotelRepository: Error al modificar al hotel con ID: ${id}.`);
            throw new Error('hotel no encontrado');
        }

        repository.merge(hotel, updateData);
        const updatedHotel = await repository.save(hotel);
        return updatedHotel;
    }
}