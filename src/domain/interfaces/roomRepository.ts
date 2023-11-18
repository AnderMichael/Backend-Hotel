import {Room} from "../models/room";

export interface RoomRepository {
    findById(id: string): Promise<Room | null>;
    createRoom(room: Room): Promise<Room>;
    deleteRoom(id: string): Promise<void>;
    updateRoom(userId: string, updateData: Partial<Room>): Promise<Room>;
}