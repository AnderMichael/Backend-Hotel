import { AuthService } from "../../app/services/authService";
import { HotelService } from "../../app/services/hotelService";
import { RoomService } from "../../app/services/roomService";
import { UserService } from "../../app/services/userService";
import { HotelRepositoryImpl } from "../../infrastructure/repositories/hotelRepositoryImpl";
import { RoomRepositoryImpl } from "../../infrastructure/repositories/roomRepositoryImpl";
import { UserRepositoryImpl } from "../../infrastructure/repositories/userRepositoryImpl";
import { TokenGeneratorImpl } from "../../infrastructure/utils/generateToken.jwt";
import { AuthController } from "./authController";
import { HotelController } from "./hotelController";
import { RoomController } from "./roomController";
import { UserController } from "./userController";

const API: string = "/api";

const encrypt = new TokenGeneratorImpl();

const userRepository = new UserRepositoryImpl();
const userService = new UserService(userRepository);
const userController = new UserController(userService);

const authService = new AuthService(userRepository, encrypt);
const authController = new AuthController(authService);

const hotelRepository = new HotelRepositoryImpl();
const hotelService = new HotelService(hotelRepository);
const hotelController = new HotelController(hotelService);

const roomRepository = new RoomRepositoryImpl();
const roomService = new RoomService(roomRepository, hotelRepository);
const roomController = new RoomController(roomService);

export const routes = (server: any) => {
  server.use(`${API}/users`, userController.router);
  server.use(`${API}/auth`, authController.router);
  server.use(`${API}/hotels`, hotelController.router);
  server.use(`${API}/rooms`, roomController.router);
};
