import { Request, Response, Router } from "express";
import { CreateReservationDTO } from "../../app/dtos/create.reservation.dto";
import logger from "../../infrastructure/logger/logger";
import { ReservationService } from "../../app/services/reservationService";
import { verifyTokenMiddleware } from "../middleware/verifyToken";
import { RoomDto } from "../../app/dtos/room.dto";
import { UserDTO } from "../../app/dtos/user.dto";

export class ReservationController {
  public router: Router;
  private reservationService: ReservationService;

  constructor(reservationService: ReservationService) {
    this.reservationService = reservationService;
    this.router = Router();
    this.routes();
  }

  public async getRemainingReservationsRoom(
    req: Request,
    res: Response
  ): Promise<void> {
    const { roomId } = req.params;
  
    try {
      const roomDto: Partial<RoomDto> =
        await this.reservationService.getRemainingReservationsRoom(roomId);
  
      if (!roomDto) {
        logger.info(
          `No remaining reservations found for room with ID ${roomId} in ReservationController`
        );
        res.status(404).json({ message: "Reservation not found" });
        return;
      }
  
      logger.debug(
        `Remaining reservations retrieved for room with ID ${roomId} in ReservationController:`,
        roomDto.reservations
      );
  
      res.status(200).json(roomDto);
    } catch (error) {
      logger.error(
        `Error getting remaining reservations for room with ID ${roomId} in ReservationController:`,
        error
      );
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
  
  public async getRemainingReservationsUser(
    req: Request,
    res: Response
  ): Promise<void> {
    const { userId } = req.params; // Update the parameter name to userId

    try {
      const userDto: Partial<UserDTO> = await this.reservationService.getRemainingReservationsUser(userId);

      if (!userDto) {
        logger.info(
          `No remaining reservations found for user with ID ${userId} in ReservationController`
        );
        res.status(404).json({ message: "Reservation not found" });
        return;
      }

      logger.debug(
        `Remaining reservations retrieved for user with ID ${userId} in ReservationController:`,
        userDto.reservations
      );

      res.status(200).json(userDto);
    } catch (error) {
      logger.error(
        `Error getting remaining reservations for user with ID ${userId} in ReservationController:`,
        error
      );
      res.status(500).json({ message: "Internal Server Error" });
    }
  }

  public async createReservation(
    req: Request,
    res: Response
  ): Promise<Response> {
    try {
      const reservationDTO: CreateReservationDTO = req.body;
      const reservation = await this.reservationService.createReservation(
        reservationDTO
      );

      logger.info(
        `Reservation created successfully in ReservationController: ${reservation.id}`
      );
      return res.status(201).json(reservation);
    } catch (error) {
      logger.error(
        "Error creating reservation in ReservationController:",
        error
      );
      return res.status(400).json({ message: error });
    }
  }

  public async getReservationById(req: Request, res: Response): Promise<void> {
    const { reservationId } = req.params;

    try {
      const reservationDto = await this.reservationService.getReservationById(
        reservationId
      );

      if (!reservationDto) {
        logger.info(
          `Reservation with ID ${reservationId} not found in ReservationController`
        );
        res.status(404).json({ message: "Reservation not found" });
        return;
      }

      logger.debug(
        `Reservation retrieved by ID ${reservationId} in ReservationController:`,
        reservationDto
      );
      res.status(200).json(reservationDto);
    } catch (error) {
      logger.error(
        `Error getting reservation by ID ${reservationId} in ReservationController:`,
        error
      );
      res.status(500).json({ message: "Internal Server Error" });
    }
  }

  public async updateReservationById(
    req: Request,
    res: Response
  ): Promise<Response> {
    const { reservationId } = req.params;
    const updatedData = req.body;

    try {
      const reservationDto =
        await this.reservationService.updateReservationById(
          reservationId,
          updatedData
        );

      if (!reservationDto) {
        logger.info(
          `Reservation with ID ${reservationId} not found in ReservationController`
        );
        return res.status(404).json({ message: "Reservation not found" });
      }

      logger.info(
        `Reservation with ID ${reservationId} updated successfully in ReservationController:`,
        reservationDto
      );
      return res.status(200).json(reservationDto);
    } catch (error) {
      logger.error(
        `Error updating reservation with ID ${reservationId} in ReservationController:`,
        error
      );
      return res.status(500).json({ message: "Error updating reservation" });
    }
  }

  public async deleteReservationById(
    req: Request,
    res: Response
  ): Promise<void> {
    const { reservationId } = req.params;

    try {
      await this.reservationService.deleteReservationById(reservationId);
      logger.info(
        `Reservation with ID ${reservationId} deleted successfully in ReservationController`
      );
      res.status(204).json({ message: "Reservation deleted successfully!" });
    } catch (error) {
      logger.error(
        `Error deleting reservation with ID ${reservationId} in ReservationController:`,
        error
      );
      res.status(500).json({ message: "Error deleting reservation" });
    }
  }

  public routes() {
    this.router.post("/", this.createReservation.bind(this));
    this.router.get("/:reservationId", this.getReservationById.bind(this));
    this.router.get(
      "/rooms/:roomId",
      this.getRemainingReservationsRoom.bind(this)
    );
    this.router.get(
      "/users/:userId",
      this.getRemainingReservationsUser.bind(this)
    );
    this.router.put("/:reservationId", this.updateReservationById.bind(this));
    this.router.delete(
      "/:reservationId",
      this.deleteReservationById.bind(this)
    );
  }
}
