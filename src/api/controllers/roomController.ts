import { Request, Response, Router } from 'express';
import {RoomService} from "../../app/services/roomService";
import logger from "../../infrastructure/logger/logger";
import {CreateRoomDTO} from "../../app/dtos/create.room.dto";

export class HotelController {
    public router: Router;
    private roomService: RoomService;


    constructor(roomService: RoomService) {
        this.roomService = roomService;
        this.router = Router();
        this.routes();
    }

    public async getRoomById(req: Request, res: Response): Promise<void> {
        const { id } = req.params;
        const roomDto = await this.roomService.getRoomById(id);

        if (!roomDto) {
            res.status(404).json({ message: 'room not found' });
            return;
        }

        res.json(roomDto);
    }

    public async createRoom(req: Request, res: Response): Promise<Response> {
        try {
            const roomDto: CreateRoomDTO = req.body;
            const room = await this.roomService.createRoom(roomDto);
            return res.status(201).json(room);
        } catch (error) {
            if (error instanceof Error) {
                console.log(error.message);
                return res.status(400).json({ message: error.message });
            }
            return res.status(400).json({ message: error });

        }
    }

    public async deleteRoom(req: Request, res: Response): Promise<Response> {
        const { roomId } = req.params;
        try {
            logger.debug(`Intentando eliminar al cuarto con ID: ${roomId}`);
            await this.roomService.deleteRoom(roomId);
            logger.info(`cuarto con ID: ${roomId} eliminado con éxito`);
            return res.status(200).json({ message: 'cuarto eliminado con éxito' });
        } catch (error) {
            logger.error(`Error al eliminar al cuarto con ID: ${roomId}. Error: ${error}`);
            return res.status(500).json({ message: error });
        }
    }

    public async updateRoom(req: Request, res: Response): Promise<Response> {
        const { roomId } = req.params;
        const updateData = req.body;
        try {
            logger.debug(`Intentando actualizar al cuarto con ID: ${roomId}`);
            const updatedRoom = await this.roomService.updateRoom(roomId, updateData);
            logger.info(`cuarto con ID: ${roomId} actualizado con éxito`);
            return res.status(200).json({ hotel: updatedRoom });
        } catch (error) {
            logger.error(`Error al actualizar al cuarto con ID: ${roomId}. Error: ${error}`);
            return res.status(500).json({ message: 'Error al actualizar el cuarto' });
        }
    };

    public routes() {
        this.router.get('/:id', this.getRoomById.bind(this));
        this.router.post('/', this.createRoom.bind(this));
        this.router.delete('/:userId', this.deleteRoom.bind(this));
        this.router.put('/:userId', this.updateRoom.bind(this));
    }
}