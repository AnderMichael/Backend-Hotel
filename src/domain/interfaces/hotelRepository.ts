import { Hotel } from "../models/hotel";
export interface HotelRepository {
    findById(id: string): Promise<Hotel | null>;
    createHotel(hotel: Hotel): Promise<Hotel>;
    deleteHotel(id: string): Promise<void>;
    updateHotel(userId: string, updateData: Partial<Hotel>): Promise<Hotel>;
}