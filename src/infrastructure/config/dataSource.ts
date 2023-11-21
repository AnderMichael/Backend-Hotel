import "reflect-metadata";
import { DataSource } from "typeorm";
import { db } from "../../infrastructure/config/config";
import { HotelEntity } from "../entities/hotelEntity";
import { UserEntity } from "../entities/userEntity";
import { RoomEntity } from "../entities/roomEntity";
import { ReservationEntity } from "../entities/reservationEntity";
import { RoleEntity } from "../entities/roleEntity";

export const AppDataSource = new DataSource({
  type: db.type as "mysql" | "mariadb" | "postgres",
  host: db.host,
  port: db.port as number,
  username: db.username,
  password: db.password,
  database: db.database,
  synchronize: true,
  logging: false,
  entities: [
    HotelEntity,
    RoleEntity,
    UserEntity,
    RoomEntity,
    ReservationEntity,
  ], // ! Agregar entities una vez creadas
  subscribers: [],
  migrations: [],
});
