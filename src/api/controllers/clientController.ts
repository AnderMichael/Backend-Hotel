import { Request, Response, Router } from "express";
import { CreateClientDTO } from "../../app/dtos/create.client.dto";
import logger from "../../infrastructure/logger/logger";
import { ClientService } from "../../app/services/clientService";

export class ClientController {
  public router: Router;
  private clientService: ClientService;

  constructor(clientService: ClientService) {
    this.clientService = clientService;
    this.router = Router();
    this.routes();
  }

  public async createClient(req: Request, res: Response): Promise<Response> {
    try {
      const clientDTO: CreateClientDTO = req.body;
      const client = await this.clientService.createClient(clientDTO);
      return res.status(201).json(client);
    } catch (error) {
      logger.error("The client could not be created due to the next error:");
      return res.status(201).json({ message: error });
    }
  }

  public async getClientById(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const clientDto = await this.clientService.getClientById(id);

    if (!clientDto) {
      res.status(404).json({ message: "Role not found" });
      return;
    }

    res.json(clientDto);
  }

  public routes() {
    this.router.post("/", this.createClient.bind(this));
    this.router.get("/:clientId", this.getClientById.bind(this));
  }
}
