import { Request, Response, Router } from "express";
import { CreateUserDTO } from "../../app/dtos/create.user.dto";
import logger from "../../infrastructure/logger/logger";
import { UserService } from "../../app/services/userService";
import { verifyTokenMiddleware } from "../middleware/verifyToken";
import {verifyRoleMiddleware} from "../middleware/verifyRole";
import {userValidationRules, validate} from "../middleware/userValidator";

export class UserController {
  public router: Router;
  private userService: UserService;

  constructor(userService: UserService) {
    this.userService = userService;
    this.router = Router();
    this.routes();
  }

  public async createUser(req: Request, res: Response): Promise<Response> {
    try {
      const userDTO: CreateUserDTO = req.body;
      const user = await this.userService.createUser(userDTO);
      logger.info(`User created successfully in UserController: ${user.id}`);
      return res.status(201).json(user);
    } catch (error) {
      logger.error("Error creating user in UserController:", error);
      return res.status(400).json({ message: error });
    }
  }

  public async getUserById(req: Request, res: Response): Promise<void> {
    const { userId } = req.params;

    try {
      const userDto = await this.userService.getUserById(userId);

      if (!userDto) {
        logger.info(`User with ID ${userId} not found in UserController`);
        res.status(404).json({ message: "User not found" });
        return;
      }

      logger.debug(
        `User retrieved by ID ${userId} in UserController:`,
        userDto
      );
      res.status(200).json(userDto);
    } catch (error) {
      logger.error(
        `Error getting user by ID ${userId} in UserController:`,
        error
      );
      res.status(500).json({ message: "Internal Server Error" });
    }
  }

  public async updateUserById(req: Request, res: Response): Promise<Response> {
    const { userId } = req.params;
    const updatedData = req.body;

    try {
      const userDto = await this.userService.updateUserById(
        userId,
        updatedData
      );

      if (!userDto) {
        logger.info(`User with ID ${userId} not found in UserController`);
        return res.status(404).json({ message: "User not found" });
      }

      logger.info(
        `User with ID ${userId} updated successfully in UserController:`,
        userDto
      );
      return res.status(200).json(userDto);
    } catch (error) {
      logger.error(
        `Error updating user with ID ${userId} in UserController:`,
        error
      );
      return res.status(500).json({ message: "Error updating user" });
    }
  }

  public async deleteUserById(req: Request, res: Response): Promise<void> {
    const { userId } = req.params;

    try {
      await this.userService.deleteUserById(userId);
      logger.info(
        `User with ID ${userId} deleted successfully in UserController`
      );
      res.status(204).json({ message: "User deleted successfully!" });
    } catch (error) {
      logger.error(
        `Error deleting user with ID ${userId} in UserController:`,
        error
      );
      res.status(500).json({ message: "Error deleting user" });
    }
  }

  public routes() {
    this.router.post("/", userValidationRules(), validate, this.createUser.bind(this));
    this.router.get("/:userId", this.getUserById.bind(this));
    this.router.put("/:userId", this.updateUserById.bind(this));
    this.router.delete("/:userId", verifyRoleMiddleware('admin'), this.deleteUserById.bind(this));
  }
}
