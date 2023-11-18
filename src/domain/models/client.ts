import { v4 as uuidv4 } from 'uuid';
import { IClientEntity } from '../entities/IClientEntity';

export class Client {
    id: string;
    username: string;
    email: string;
    hashedPassword: string;

    constructor(clientEntity: IClientEntity) {
        this.id = clientEntity.id || uuidv4();
        this.username = clientEntity.username;
        this.email = clientEntity.email;
        this.hashedPassword = clientEntity.hashedPassword;
    }
}