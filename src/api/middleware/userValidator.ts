import { NextFunction, Response, Request } from "express";
import { body, validationResult } from 'express-validator';

export const userValidationRules = () => {
    return [
        body('username').isAlphanumeric(),
        body('password').isLength({ min: 8 }).withMessage('El password debe tener 8 caracteres como minimo'),
        body('email').isEmail(),
        body('role').isNumeric(),
    ]
}

export const validate = (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};