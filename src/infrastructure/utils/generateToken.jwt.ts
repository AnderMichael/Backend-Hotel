import { TokenGenerator } from '../../app/utils/generateToken';
import { jwt as jwtConfig } from '../config/config';
import jwt from 'jsonwebtoken';

export class TokenGeneratorImpl implements TokenGenerator {
    encrypt(data: any): string {
        const token = jwt.sign(data, jwtConfig.secretKey, { expiresIn: jwtConfig.expirationTime });
        return token;
    }
    decrypt(text: string): string {
        throw new Error("Method not implemented.");
    }

}