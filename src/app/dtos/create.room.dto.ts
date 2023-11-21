export interface CreateRoomDTO {
  id?: string;
  number: number;
  category: string;
  available: boolean;
  capacity: number;
  price: number;
  hotelId: string;
}
