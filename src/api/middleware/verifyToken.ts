import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { jwt as jwtConfig } from '../../infrastructure/config/config';
import logger from '../../infrastructure/logger/logger';

export const verifyTokenMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (authHeader) {
        const token = authHeader.split(' ')[1];
        jwt.verify(token, jwtConfig.secretKey, (err, user: any) => {
            if (err) {
                logger.error(`Invalid token: ${err.message}`);
                return res.status(403).json({ message: "Invalid token" });
            }
            req.user_id = user.userId;
            logger.info(`User with ID ${user.userId} authenticated successfully in verifyTokenMiddleware`);
            next();
        });
    } else {
        logger.error('Token not provided in verifyTokenMiddleware');
        res.status(401).json({ message: "Token not provided" });
    }
};
