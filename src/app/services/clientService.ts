import { IClientEntity } from "../../domain/entities/IClientEntity";
import { ClientRepository } from "../../domain/interfaces/clientRepository";
import { Client } from "../../domain/models/client";
import { ClientDTO } from "../dtos/client.dto";
import { CreateClientDTO } from "../dtos/create.client.dto";

export class ClientService {
  constructor(private clientRepository: ClientRepository) {}

  async createClient(clientDTO: CreateClientDTO): Promise<Client> {
    const clientEntity: IClientEntity = {
      username: clientDTO.username,
      email: clientDTO.email,
      hashedPassword: clientDTO.hashedPassword,
    };
    const newClient = new Client(clientEntity);
    return this.clientRepository.createClient(newClient);
  }

  async getClientById(id: string): Promise<ClientDTO | null> {
    const client = await this.clientRepository.findById(id);
    if (!client) {
      return client;
    }

    const clientResponse: ClientDTO = {
      id: client.id,
      username: client.username,
      email: client.email,
    };
    return clientResponse;
  }
}
