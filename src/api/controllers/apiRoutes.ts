import { UserService } from "../../app/services/userService";
import { UserRepositoryImpl } from "../../infrastructure/repositories/userRepositoryImpl";
import { UserController } from "./userController";

const API: string = "/api";

const userRepository = new UserRepositoryImpl();
const userService = new UserService(userRepository);
const userController = new UserController(userService);

export const routes = (server: any) => {
  server.use(`${API}/users`, userController.router);
  //   server.use(`${API}/roles`, roleController.router);
  //   server.use(`${API}/auth`, authController.router);
};
