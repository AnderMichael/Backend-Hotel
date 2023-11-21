import { Request, Response, Router } from "express";
import { HotelService } from "../../app/services/hotelService";
import { CreateHotelDTO } from "../../app/dtos/create.hotel.dto";
import logger from "../../infrastructure/logger/logger";
import {verifyRoleMiddleware} from "../middleware/verifyRole";
import {verifyTokenMiddleware} from "../middleware/verifyToken";

export class HotelController {
  public router: Router;
  private hotelService: HotelService;

  constructor(hotelService: HotelService) {
    this.hotelService = hotelService;
    this.router = Router();
    this.routes();
  }

  public async getHotelById(req: Request, res: Response): Promise<void> {
    const { hotelId } = req.params;

    try {
      const hotelDto = await this.hotelService.getHotelById(hotelId);

      if (!hotelDto) {
        logger.info(`Hotel with ID ${hotelId} not found in HotelController`);
        res.status(404).json({ message: "hotel not found" });
        return;
      }

      logger.debug(
        `Hotel retrieved by ID ${hotelId} in HotelController:`,
        hotelDto
      );
      res.json(hotelDto);
    } catch (error) {
      logger.error(
        `Error getting hotel by ID ${hotelId} in HotelController. Error: ${error}`
      );
      res.status(500).json({ message: "Internal Server Error" });
    }
  }

  public async createHotel(req: Request, res: Response): Promise<Response> {
    try {
      const hotelDto: CreateHotelDTO = req.body;
      const hotel = await this.hotelService.createHotel(hotelDto);

      logger.info(`Hotel created successfully in HotelController: ${hotel.id}`);
      logger.debug(`Hotel details in HotelController:`, hotel);
      return res.status(201).json(hotel);
    } catch (error) {
      logger.error(`Error creating hotel in HotelController. Error: ${error}`);
      return res.status(400).json({ message: error });
    }
  }

  public async deleteHotel(req: Request, res: Response): Promise<Response> {
    const { hotelId } = req.params;

    try {
      logger.debug(
        `Attempting to delete hotel with ID: ${hotelId} in HotelController`
      );
      await this.hotelService.deleteHotel(hotelId);
      logger.info(
        `Hotel with ID: ${hotelId} deleted successfully in HotelController`
      );
      return res.status(200).json({ message: "Hotel deleted successfully" });
    } catch (error) {
      logger.error(
        `Error deleting hotel with ID ${hotelId} in HotelController. Error: ${error}`
      );
      return res.status(500).json({ message: error });
    }
  }

  public async updateHotel(req: Request, res: Response): Promise<Response> {
    const { hotelId } = req.params;
    const updateData = req.body;

    try {
      logger.debug(
        `Attempting to update hotel with ID: ${hotelId} in HotelController`
      );
      const updatedHotel = await this.hotelService.updateHotel(
        hotelId,
        updateData
      );
      logger.info(
        `Hotel with ID: ${hotelId} updated successfully in HotelController`
      );
      logger.debug(`Updated hotel details in HotelController:`, updatedHotel);
      return res.status(200).json({ hotel: updatedHotel });
    } catch (error) {
      logger.error(
        `Error updating hotel with ID ${hotelId} in HotelController. Error: ${error}`
      );
      return res.status(500).json({ message: "Error updating hotel" });
    }
  }

  public routes() {
    this.router.get("/:hotelId", verifyTokenMiddleware,this.getHotelById.bind(this));
    this.router.post("/", verifyTokenMiddleware,verifyRoleMiddleware('admin'), this.createHotel.bind(this));
    this.router.delete("/:hotelId", verifyTokenMiddleware, verifyRoleMiddleware('admin'), this.deleteHotel.bind(this));
    this.router.put("/:hotelId", verifyTokenMiddleware, verifyRoleMiddleware('admin'), this.updateHotel.bind(this));
  }
}
