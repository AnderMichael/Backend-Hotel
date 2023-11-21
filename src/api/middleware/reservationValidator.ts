import { NextFunction, Response, Request } from "express";
import { body, validationResult } from 'express-validator';
import {RoomRepositoryImpl} from "../../infrastructure/repositories/roomRepositoryImpl";

export const reservationValidationRules = () => {
    return [
        body('reservationInit')
            .isISO8601().toDate()
            .withMessage('Invalid start date format. Use ISO8601 format.'),

        // Validate end date
        body('reservationEnd')
            .isISO8601().toDate()
            .withMessage('Invalid end date format. Use ISO8601 format.')
            .custom((value, { req }) => {
                const startDate = new Date(req.body.reservationInit);
                const endDate = new Date(value);
                if (endDate <= startDate) {
                    throw new Error('End date must be after the start date.');
                }
                return true;
            }),
        body('payment')
            .isNumeric().withMessage('Payment must be a numeric value.')
            .custom(async (value, {req}) => {
                const startDate = new Date(req.body.reservationInit);
                const endDate = new Date(req.body.reservationEnd);
                const roomRepository = new RoomRepositoryImpl();
                console.log(req.body.roomId)
                const pricePerNight = await roomRepository.getPriceById(req.body.roomId)

                const nights = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));

                const totalCost = nights * pricePerNight;
                if (Number(value) < totalCost) {
                    throw new Error('Payment must be sufficient for the duration of the reservation.');
                }
                return true;
            }),
    ]
}

export const validate = (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};