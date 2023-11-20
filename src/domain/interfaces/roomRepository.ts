import { Hotel } from "../models/hotel";
import {Room} from "../models/room";

export interface RoomRepository {
    findAllbyHotel(hotel: Hotel): Promise<Room[]>
    findById(id: string): Promise<Room | null>;
    createRoom(room: Room): Promise<Room>;
    deleteRoom(id: string): Promise<void>;
    updateRoom(userId: string, updateData: Partial<Room>): Promise<Room>;
}