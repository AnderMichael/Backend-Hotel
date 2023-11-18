import { ClientService } from "../../app/services/clientService";
import { ClientRepositoryImpl } from "../../infrastructure/repositories/clientRepositoryImpl";
import { ClientController } from "./clientController";

const API: string = "/api";

const clientRepository = new ClientRepositoryImpl();
const clientService = new ClientService(clientRepository);
const clientController = new ClientController(clientService);

export const routes = (server: any) => {
  server.use(`${API}/clients`, clientController.router);
  //   server.use(`${API}/roles`, roleController.router);
  //   server.use(`${API}/auth`, authController.router);
};
