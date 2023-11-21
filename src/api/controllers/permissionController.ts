import { Request, Response, Router } from 'express';
import logger from '../../infrastructure/logger/logger';
import { PermissionService } from '../../app/services/permissionService';
import { CreatePermissionDto } from '../../app/dtos/create.permission.dto';
import { PermissionDto } from '../../app/dtos/permission.dto';
import { UpdatePermissionDto } from '../../app/dtos/update.permission.dto';
import {verifyRoleMiddleware} from "../middleware/verifyRole";

export class PermissionController {
    public router: Router;
    private permissionService: PermissionService;

    constructor(permissionService: PermissionService) {
        this.permissionService = permissionService;
        this.router = Router();
        this.routes();
    }

    public async getPermissionById(req: Request, res: Response): Promise<void> {
        logger.info("Dentro de permission by id controller");
        const { id } = req.params;
        const permissionDto = await this.permissionService.getPermissionById(id);
        
        if (!permissionDto) {
            logger.error("Error al conseguir permission", req.params);
            res.status(404).json({ message: 'permission not found' });
            return;
        }else{
            logger.debug(`permissionenviado por roleService ${JSON.stringify(permissionDto)}`)
        }

        res.json(permissionDto);
    }

    public async createPermission(req: Request, res: Response): Promise<Response> {
        logger.info("Dentro de create permission controller");
        try {
            const permissionDto: CreatePermissionDto = req.body;
            const permission = await this.permissionService.createPermission(permissionDto);
            logger.debug(`permission enviado por userService ${JSON.stringify(permission)}`)
            return res.status(201).json(permission);
        } catch (error) {
            logger.error("Error al crear permission: "+error, req.body);
            return res.status(400).json({ message: 'No se pudo crear el permission' });
        }
    }

    public async updatePermission(req: Request, res: Response): Promise<Response> {
        logger.info("Dentro de update role controller");
        try {
            const { id } = req.params;
            const permissionDto: UpdatePermissionDto = req.body;
            const permission = await this.permissionService.updatePermission(permissionDto, id);
            logger.debug(`permission enviado por permissionService ${JSON.stringify(permission)}`)
            return res.status(201).json(permission);
        } catch (error) {
            logger.error("Error al actualizar permission: "+error, req.body);
            return res.status(400).json({ message: 'No se pudo actualizar el permission' });
        }
    }

    public async deletePermission(req: Request, res: Response): Promise<void> {
        logger.info("Dentro de delete permission by id controller");
        const { id } = req.params;
        const permissionDto = await this.permissionService.deletePermission(id);
        
        if (!permissionDto) {
            logger.error("Error al eliminar permission", req.params);
            res.status(404).json({ message: 'permission not deleted' });
            return;
        }else{
            logger.debug(`permission enviado por roleService ${JSON.stringify(permissionDto)}`)
        }

        res.json(permissionDto);
    }

    public routes() {
        this.router.get('/:id', verifyRoleMiddleware('admin'), this.getPermissionById.bind(this));
        this.router.post('/', verifyRoleMiddleware('admin'), this.createPermission.bind(this));
        this.router.put('/:id', verifyRoleMiddleware('admin'), this.updatePermission.bind(this));
        this.router.delete('/:id', verifyRoleMiddleware('admin'), this.deletePermission.bind(this));
    }
}
