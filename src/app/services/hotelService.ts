import {HotelRepository} from "../../domain/interfaces/hotelRepository";
import {HotelDto} from "../dtos/hotel.dto";
import {Hotel} from "../../domain/models/hotel";
import {IHotelEntity} from "../../domain/entities/IHotelEntity";
import logger from "../../infrastructure/logger/logger";
import {CreateHotelDTO} from "../dtos/create.hotel.dto";

export class RoomService {
    constructor(private hotelRepository: HotelRepository) { }

    async getHotelById(id: string): Promise<HotelDto | null> {

        const hotel = await this.hotelRepository.findById(id);
        // log.debug user

        if (!hotel) return null;

        const hotelResponse : HotelDto= {
            id: hotel.id,
            name: hotel.name,
            location: hotel.location,
            roomsAvailable: hotel.roomsAvailable,
            roomsTotal: hotel.roomsTotal
        }
        // log.info user obtenido exitosamente
        return hotelResponse;
    }

    async createHotel(hotelDto: CreateHotelDTO): Promise<Hotel> {

        const hotelEntity: IHotelEntity = {
            createdAt: new Date(),
            id: hotelDto.id,
            location: hotelDto.location,
            name: hotelDto.name,
            roomsAvailable: hotelDto.roomsAvailable,
            roomsTotal: hotelDto.roomsTotal

        };
        const newHotel = new Hotel(hotelEntity);

        return this.hotelRepository.createHotel(newHotel);
    }

    async deleteHotel(hotelId: string): Promise<void> {
        logger.debug(`HotelService: Intentando eliminar al hotel con ID: ${hotelId}`);
        await this.hotelRepository.deleteHotel(hotelId);
    }

    async updateHotel(hotelId: string, updateData: Partial<CreateHotelDTO>): Promise<Hotel> {
        logger.debug(`HotelService: Intentando actualizar al hotel con ID: ${hotelId}`);
        return this.hotelRepository.updateHotel(hotelId, updateData);
    }
}