import express, { Request, Response } from "express";
import morgan from "morgan";
import dotenv from "dotenv";

import { AppDataSource } from "./infrastructure/config/dataSource";

import logger from "./infrastructure/logger/logger";
import { env } from "./infrastructure/config/config";
import { routes } from "./api/controllers/apiRoutes";
import {RoleRepositoryImpl} from "./infrastructure/repositories/roleRepository";
import {RoleService} from "./app/services/roleService";
import {RoleController} from "./api/controllers/roleController";

AppDataSource.initialize()
  .then(() => {
    const app = express();
    dotenv.config();

    const PORT = env.port;

      const roleRepository = new RoleRepositoryImpl();
      const roleService = new RoleService(roleRepository);
      const roleController = new RoleController(roleService);

    app.use(express.json());

    // Setup Logger
    app.use(
      morgan("combined", {
        stream: { write: (message: string) => logger.info(message.trim()) },
      })
    );

    app.get("/", (req: Request, res: Response) => {
      res.send("Servidor Up");
    });

    routes(app);

    app.listen(PORT, () => {
      console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
    });
  })
  .catch((error) => console.log(error));
