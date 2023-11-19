import { Request, Response, Router } from 'express';
import {RoomService} from "../../app/services/hotelService";
import {CreateHotelDTO} from "../../app/dtos/create.hotel.dto";
import logger from "../../infrastructure/logger/logger";

export class HotelController {
    public router: Router;
    private hotelService: RoomService;


    constructor(hotelService: RoomService) {
        this.hotelService = hotelService;
        this.router = Router();
        this.routes();
    }

    public async getHotelById(req: Request, res: Response): Promise<void> {
        const { id } = req.params;
        const hotelDto = await this.hotelService.getHotelById(id);

        if (!hotelDto) {
            res.status(404).json({ message: 'hotel not found' });
            return;
        }

        res.json(hotelDto);
    }

    public async createHotel(req: Request, res: Response): Promise<Response> {
        try {
            const hotelDto: CreateHotelDTO = req.body;
            const hotel = await this.hotelService.createHotel(hotelDto);
            return res.status(201).json(hotel);
        } catch (error) {
            if (error instanceof Error) {
                console.log(error.message);
                return res.status(400).json({ message: error.message });
            }
            return res.status(400).json({ message: error });

        }
    }

    public async deleteHotel(req: Request, res: Response): Promise<Response> {
        const { hotelId } = req.params;
        try {
            logger.debug(`Intentando eliminar al hotel con ID: ${hotelId}`);
            await this.hotelService.deleteHotel(hotelId);
            logger.info(`hotel con ID: ${hotelId} eliminado con éxito`);
            return res.status(200).json({ message: 'hotel eliminado con éxito' });
        } catch (error) {
            logger.error(`Error al eliminar al hotel con ID: ${hotelId}. Error: ${error}`);
            return res.status(500).json({ message: error });
        }
    }

    public async updateHotel(req: Request, res: Response): Promise<Response> {
        const { hotelId } = req.params;
        const updateData = req.body;
        try {
            logger.debug(`Intentando actualizar al usuario con ID: ${hotelId}`);
            const updatedHotel = await this.hotelService.updateHotel(hotelId, updateData);
            logger.info(`Usuario con ID: ${hotelId} actualizado con éxito`);
            return res.status(200).json({ hotel: updatedHotel });
        } catch (error) {
            logger.error(`Error al actualizar al usuario con ID: ${hotelId}. Error: ${error}`);
            return res.status(500).json({ message: 'Error al actualizar el usuario' });
        }
    };

    public routes() {
        this.router.get('/:id', this.getHotelById.bind(this));
        this.router.post('/', this.createHotel.bind(this));
        this.router.delete('/:userId', this.deleteHotel.bind(this));
        this.router.put('/:userId', this.updateHotel.bind(this));
    }
}