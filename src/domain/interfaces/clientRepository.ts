import { Client } from "../models/client";

export interface ClientRepository {
    findAll(): Promise<Client[]>;
    findById(id: string): Promise<Client | null>;
    createClient(user: Client): Promise<Client>;
    deleteClient(id: string): Promise<void>;
    updateClient(userId: string, updateData: Partial<Client>): Promise<Client>;
    findByEmail(email: string): Promise<Client | null>;
}