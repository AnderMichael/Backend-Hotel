import { AuthService } from "../../app/services/authService";
import { UserService } from "../../app/services/userService";
import { UserRepositoryImpl } from "../../infrastructure/repositories/userRepositoryImpl";
import { TokenGeneratorImpl } from "../../infrastructure/utils/generateToken.jwt";
import { AuthController } from "./authController";
import { UserController } from "./userController";

const API: string = "/api";

const encrypt = new TokenGeneratorImpl();

const userRepository = new UserRepositoryImpl();
const userService = new UserService(userRepository);
const userController = new UserController(userService);

const authService = new AuthService(userRepository, encrypt);
const authController = new AuthController(authService);


export const routes = (server: any) => {
  server.use(`${API}/users`, userController.router);
  server.use(`${API}/auth`, authController.router);

  //   server.use(`${API}/roles`, roleController.router);
  //   server.use(`${API}/auth`, authController.router);
};
