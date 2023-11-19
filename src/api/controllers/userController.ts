import { Request, Response, Router } from "express";
import { CreateUserDTO } from "../../app/dtos/create.user.dto";
import logger from "../../infrastructure/logger/logger";
import { UserService } from "../../app/services/userService";
import { verifyTokenMiddleware } from "../middleware/verifyToken";

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
      return res.status(201).json(user);
    } catch (error) {
      logger.error("The User could not be created due to the next error:");
      return res.status(400).json({ message: error });
    }
  }

  public async getUserById(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const userDto = await this.userService.getUserById(id);

    if (!userDto) {
      res.status(404).json({ message: "Role not found" });
      return;
    }

    res.status(200).json(userDto);
  }

  public async updateUserById(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;
    const updatedData = req.body;
    const userDto = await this.userService.updateUserById(id, updatedData);

    if (!userDto) {
      return res.status(404).json({ message: "Role not found" });
    }

    return res.status(200).json(userDto);
  }

  public async deleteUserById(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    await this.userService.deleteUserById(id);
    res.status(204).json({ message: "User deleted succesfully!" });
  }

  public routes() {
    this.router.post("/", verifyTokenMiddleware, this.createUser.bind(this));
    this.router.get("/:userId", this.getUserById.bind(this));
    this.router.put("/:userId", this.updateUserById.bind(this));
    this.router.delete("/:userId", this.deleteUserById.bind(this));
  }
}
