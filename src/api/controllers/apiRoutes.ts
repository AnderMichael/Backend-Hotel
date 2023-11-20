import { AuthService } from "../../app/services/authService";
import { HotelService } from "../../app/services/hotelService";
import { ReservationService } from "../../app/services/reservationService";
import { RoomService } from "../../app/services/roomService";
import { UserService } from "../../app/services/userService";
import { HotelRepositoryImpl } from "../../infrastructure/repositories/hotelRepositoryImpl";
import { ReservationRepositoryImpl } from "../../infrastructure/repositories/reservationRepositoryImpl";
import { RoomRepositoryImpl } from "../../infrastructure/repositories/roomRepositoryImpl";
import { UserRepositoryImpl } from "../../infrastructure/repositories/userRepositoryImpl";
import { TokenGeneratorImpl } from "../../infrastructure/utils/generateToken.jwt";
import { AuthController } from "./authController";
import { HotelController } from "./hotelController";
import { ReservationController } from "./reservationController";
import { RoomController } from "./roomController";
import { UserController } from "./userController";
import {RoleRepositoryImpl} from "../../infrastructure/repositories/roleRepository";
import {RoleService} from "../../app/services/roleService";
import {RoleController} from "./roleController";

const API: string = "/api";

const encrypt = new TokenGeneratorImpl();

const userRepository = new UserRepositoryImpl();
const roomRepository = new RoomRepositoryImpl();
const hotelRepository = new HotelRepositoryImpl();
const reservationRepository = new ReservationRepositoryImpl();
const roleRepository = new RoleRepositoryImpl();

const userService = new UserService(userRepository);
const userController = new UserController(userService);

const authService = new AuthService(userRepository, encrypt);
const authController = new AuthController(authService);

const roomService = new RoomService(roomRepository, hotelRepository);
const roomController = new RoomController(roomService);

const hotelService = new HotelService(hotelRepository, roomRepository);
const hotelController = new HotelController(hotelService);

const roleService = new RoleService(roleRepository);
const roleController = new RoleController(roleService);

const reservationService = new ReservationService(
  reservationRepository,
  userRepository,
  roomRepository
);
const reservationController = new ReservationController(reservationService);

export const routes = (server: any) => {
  server.use(`${API}/users`, userController.router);
  server.use(`${API}/auth`, authController.router);
  server.use(`${API}/hotels`, hotelController.router);
  server.use(`${API}/rooms`, roomController.router);
  server.use(`${API}/reservations`, reservationController.router);
  server.use('/${API}roles', roleController.router);

};