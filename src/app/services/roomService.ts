import {RoomDto} from "../dtos/room.dto";
import {IRoomEntity} from "../../domain/entities/IRoomEntity";
import {CreateRoomDTO} from "../dtos/create.room.dto";
import logger from "../../infrastructure/logger/logger";
import {Room} from "../../domain/models/room";
import {RoomRepository} from "../../domain/interfaces/roomRepository";
import {HotelRepository} from "../../domain/interfaces/hotelRepository";


export class RoomService {
    constructor(private roomRepository: RoomRepository, private hotelRepository: HotelRepository) { }

    async getRoomById(id: string): Promise<RoomDto | null> {

        const room = await this.roomRepository.findById(id);
        // log.debug user

        if (!room) return null;

        const roomResponse : RoomDto= {
            available: room.available,
            capacity: room.capacity,
            category: room.category,
            id: room.id,
            number: room.number,
            price: room.price

        }
        // log.info user obtenido exitosamente
        return roomResponse;
    }

    async createRoom(roomDto: CreateRoomDTO): Promise<Room> {
        const hotel = await this.hotelRepository.findById(roomDto.hotelId)
        if (!hotel) {
            throw new Error('Rol no encontrado');
        }
        const roomEntity: IRoomEntity = {
            available: roomDto.available,
            capacity: roomDto.capacity,
            category: roomDto.category,
            createdAt: new Date(),
            hotel ,
            id: roomDto.id ,
            number: roomDto.number,
            price: roomDto.price

        };
        const newRoom = new Room(roomEntity);

        return this.roomRepository.createRoom(newRoom);
    }

    async deleteRoom(roomId: string): Promise<void> {
        logger.debug(`RoomService: Intentando eliminar al cuarto con ID: ${roomId}`);
        await this.roomRepository.deleteRoom(roomId);
    }

    async updateRoom(roomId: string, updateData: Partial<CreateRoomDTO>): Promise<Room> {
        logger.debug(`RoomService: Intentando actualizar al cuarto con ID: ${roomId}`);
        return this.roomRepository.updateRoom(roomId, updateData);
    }
}