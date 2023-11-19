import {RoomRepository} from "../../domain/interfaces/roomRepository";
import {Room} from "../../domain/models/room";
import {AppDataSource} from "../config/dataSource";
import logger from "../logger/logger";
import {RoomEntity} from "../entities/roomEntity";


export class RoomRepositoryImpl implements RoomRepository {
    async findById(id: string): Promise<Room | null> {
        logger.info('Alguna información relevante');
        const roomRepository = AppDataSource.getRepository(RoomEntity);
        const room = await roomRepository.findOne({
            where: { id },
            relations: ['hotel']
        });
        return room ? new Room(room) : null;
    }

    async createRoom(room: Room): Promise<Room> {
        const roomRepository = AppDataSource.getRepository(RoomEntity);

        const roomEntity = roomRepository.create({
            id:room.id,
            number:room.number,
            price:room.price,
            createdAt: room.createdAt,
            hotel: room.hotel,
            capacity: room.capacity,
            category: room.category,
        });

        const roomResponse = await roomRepository.save(roomEntity);

        return new Room({
            id:roomResponse.id,
            number:roomResponse.number,
            price:roomResponse.price,
            createdAt: roomResponse.createdAt,
            hotel: roomResponse.hotel,
            capacity: roomResponse.capacity,
            category: roomResponse.category,

        });
    }

    async deleteRoom(id: string): Promise<void> {

        const repository = AppDataSource.getRepository(RoomEntity);
        const room = await repository.findOneBy({ id });

        if (!room) {
            logger.error(`roomRepository: Error al eliminar al cuarto con ID: ${id}.`);
            throw new Error('cuarto no encontrado');
        }

        await repository.remove(room);
    }

    async updateRoom(id: string, updateData: Partial<Room>): Promise<Room> {
        const repository = AppDataSource.getRepository(RoomEntity);
        const room = await repository.findOneBy({ id });

        if (!room) {
            logger.error(`hotelRepository: Error al modificar al  cuarto con ID: ${id}.`);
            throw new Error('hotel no encontrado');
        }

        repository.merge(room, updateData);
        const updatedRoom = await repository.save(room);
        return updatedRoom;
    }
}