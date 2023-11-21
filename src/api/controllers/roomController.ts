import { Request, Response, Router } from "express";
import { RoomService } from "../../app/services/roomService";
import logger from "../../infrastructure/logger/logger";
import { CreateRoomDTO } from "../../app/dtos/create.room.dto";
import {verifyRoleMiddleware} from "../middleware/verifyRole";
import {verifyTokenMiddleware} from "../middleware/verifyToken";

export class RoomController {
  public router: Router;
  private roomService: RoomService;

  constructor(roomService: RoomService) {
    this.roomService = roomService;
    this.router = Router();
    this.routes();
  }

  public async getRoomById(req: Request, res: Response): Promise<void> {
    const { roomId } = req.params;

    try {
      const roomDto = await this.roomService.getRoomById(roomId);

      if (!roomDto) {
        logger.info(`Room with ID ${roomId} not found in RoomController`);
        res.status(404).json({ message: "room not found" });
        return;
      }

      logger.debug(
        `Room retrieved by ID ${roomId} in RoomController:`,
        roomDto
      );
      res.json(roomDto);
    } catch (error) {
      logger.error(
        `Error getting room by ID ${roomId} in RoomController. Error: ${error}`
      );
      res.status(500).json({ message: "Internal Server Error" });
    }
  }

  public async createRoom(req: Request, res: Response): Promise<Response> {
    try {
      const roomDto: CreateRoomDTO = req.body;
      const room = await this.roomService.createRoom(roomDto);

      logger.info(`Room created successfully in RoomController: ${room.id}`);
      logger.debug(`Room details in RoomController:`, room);
      return res.status(201).json(room);
    } catch (error) {
      logger.error(`Error creating room in RoomController. Error: ${error}`);
      return res.status(400).json({ message: error });
    }
  }

  public async deleteRoom(req: Request, res: Response): Promise<Response> {
    const { roomId } = req.params;

    try {
      logger.debug(
        `Attempting to delete room with ID: ${roomId} in RoomController`
      );
      await this.roomService.deleteRoom(roomId);
      logger.info(
        `Room with ID: ${roomId} deleted successfully in RoomController`
      );
      return res.status(200).json({ message: "Room deleted successfully" });
    } catch (error) {
      logger.error(
        `Error deleting room with ID ${roomId} in RoomController. Error: ${error}`
      );
      return res.status(500).json({ message: error });
    }
  }

  public async updateRoom(req: Request, res: Response): Promise<Response> {
    const { roomId } = req.params;
    const updateData = req.body;

    try {
      logger.debug(
        `Attempting to update room with ID: ${roomId} in RoomController`
      );
      const updatedRoom = await this.roomService.updateRoom(roomId, updateData);
      logger.info(
        `Room with ID: ${roomId} updated successfully in RoomController`
      );
      logger.debug(`Updated room details in RoomController:`, updatedRoom);
      return res.status(200).json({ room: updatedRoom });
    } catch (error) {
      logger.error(
        `Error updating room with ID ${roomId} in RoomController. Error: ${error}`
      );
      return res.status(500).json({ message: "Error updating room" });
    }
  }

  public routes() {
    this.router.get("/:roomId", verifyTokenMiddleware, this.getRoomById.bind(this));
    this.router.post("/", verifyTokenMiddleware, verifyRoleMiddleware('admin'), this.createRoom.bind(this));
    this.router.delete("/:roomId", verifyTokenMiddleware, verifyRoleMiddleware('admin'), this.deleteRoom.bind(this));
    this.router.put("/:roomId", verifyTokenMiddleware, verifyRoleMiddleware('admin'), this.updateRoom.bind(this));
  }
}
