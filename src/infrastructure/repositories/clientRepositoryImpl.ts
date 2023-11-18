import { ClientRepository } from "../../domain/interfaces/clientRepository";
import { Client } from "../../domain/models/client";
import { AppDataSource } from "../config/dataSource";
import { ClientEntity } from "../entities/clientEntity";
import logger from "../logger/logger";
import bcrypt from "bcrypt";

export class ClientRepositoryImpl implements ClientRepository {
  async findAll(): Promise<Client[]> {
    const clientRepository = AppDataSource.getRepository(ClientEntity);
    const clients = await clientRepository.find();
    return clients.map((client) => new Client(client));
  }

  async findById(id: string): Promise<Client | null> {
    const clientRepository = AppDataSource.getRepository(ClientEntity);
    const client = await clientRepository.findOne({ where: { id } });
    return client ? new Client(client) : null;
  }

  async findByEmail(email: string): Promise<Client | null> {
    const clientRepository = AppDataSource.getRepository(ClientEntity);
    const client = await clientRepository.findOne({ where: { email } });
    return client ? new Client(client) : null;
  }
  async createClient(client: Client): Promise<Client> {
    const clientRepository = AppDataSource.getRepository(ClientEntity);

    try {
      const hashedPassword = bcrypt.hashSync(client.hashedPassword, 10);
      const clientEntity = clientRepository.create({
        id: client.id,
        username: client.username,
        email: client.email,
        hashedPassword: hashedPassword,
      });

      const clientResponse = await clientRepository.save(clientEntity);

      return new Client({
        id: clientResponse.id,
        username: clientResponse.username,
        email: clientResponse.email,
        hashedPassword: clientResponse.hashedPassword,
      });
    } catch (error) {
      logger.error(`Error creating client: ${error}`);
      throw error;
    }
  }

  async deleteClient(id: string): Promise<void> {
    const repository = AppDataSource.getRepository(ClientEntity);

    try {
      const client = await repository.findOne({ where: { id } });

      if (!client) {
        throw new Error(
          `ClientRepository: Error deleting client with ID: ${id}. Client not found.`
        );
      }

      await repository.remove(client);
    } catch (error) {
      logger.error(`Error deleting client: ${error}`);
      throw error;
    }
  }

  async updateClient(id: string, updateData: Partial<Client>): Promise<Client> {
    const repository = AppDataSource.getRepository(ClientEntity);

    try {
      const client = await repository.findOne({ where: { id } });

      if (!client) {
        throw new Error(
          `ClientRepository: Error updating client with ID: ${id}. Client not found.`
        );
      }

      repository.merge(client, updateData);
      const updatedClient = await repository.save(client);
      return updatedClient;
    } catch (error) {
      logger.error(`Error updating client: ${error}`);
      throw error;
    }
  }
}
