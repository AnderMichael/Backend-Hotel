export interface IHotelEntity {
    id?: string;
    name: string;
    roomsTotal: number;
    roomsAvailable: number;
    location: string;
    createdAt: Date;
}