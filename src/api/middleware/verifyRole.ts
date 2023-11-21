import { Request, Response, NextFunction } from 'express';
import logger from '../../infrastructure/logger/logger';
import jwt from "jsonwebtoken";
import {jwt as jwtConfig} from "../../infrastructure/config/config";
import {RoleRepositoryImpl} from "../../infrastructure/repositories/roleRepository";
import {UserRepositoryImpl} from "../../infrastructure/repositories/userRepositoryImpl";

export const verifyRoleMiddleware = (requiredRole: string) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        const authHeader = req.headers.authorization;
        const userRepository = new UserRepositoryImpl();
        const roleRepository = new RoleRepositoryImpl();

        if (authHeader) {
            const token = authHeader.split(' ')[1];
            jwt.verify(token, jwtConfig.secretKey, async (err, user: any) => {
                if (err) {
                    logger.error(`Invalid token: ${err.message}`);
                    return res.status(403).json({message: "Invalid token"});
                }
                req.user_id = user.userId;
                logger.info(`User with ID ${user.userId} authenticated successfully in verifyTokenMiddleware`);
                try {
                    const user1 = userRepository.findById(user.userId);
                    const roleId = (await user1).role.id;
                    const role = roleRepository.findById(roleId);

                    if (role && (await role).name === requiredRole) {
                        logger.info(`User with ID ${req.user_id} has the required role (${requiredRole})`);
                        next();
                    } else {
                        logger.error(`User with ID ${req.user_id} does not have the required role (${requiredRole})`);
                        res.status(403).json({message: 'Insufficient permissions'});
                    }
                } catch (error) {
                    logger.error(`Error retrieving user role`);
                    res.status(500).json({message: 'Internal Server Error'});
                }
            });
        } else {
            logger.error('Token not provided in verifyTokenMiddleware');
            res.status(401).json({message: "Token not provided"});
        }
    }
};