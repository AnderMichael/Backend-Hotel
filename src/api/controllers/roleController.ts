import { Request, Response, Router } from 'express';
import { RoleService } from '../../app/services/roleService';
import { CreateRoleDTO } from '../../app/dtos/create.role.dto';
import {verifyRoleMiddleware} from "../middleware/verifyRole";
import {verifyTokenMiddleware} from "../middleware/verifyToken";

export class RoleController {
    public router: Router;
    private roleService: RoleService;

    constructor(roleService: RoleService) {
        this.roleService = roleService;
        this.router = Router();
        this.routes();
    }

    public async createRole(req: Request, res: Response): Promise<Response> {
        try {
            const roleDto: CreateRoleDTO = req.body;
            const role = await this.roleService.createRole(roleDto);
            return res.status(201).json(role);
        } catch (error) {
            console.log(error);
            return res.status(400).json({ message: error });
        }
    }

    public async getRoleById(req: Request, res: Response): Promise<void> {
        const { id } = req.params;
        const userDto = await this.roleService.getRoleById(id);

        if (!userDto) {
            res.status(404).json({ message: 'Role not found' });
            return;
        }

        res.json(userDto);
    }


    public routes() {
        this.router.get('/:id', verifyTokenMiddleware, verifyRoleMiddleware('admin'), this.getRoleById.bind(this));
        this.router.post('/', verifyTokenMiddleware, verifyRoleMiddleware('admin'), this.createRole.bind(this));
    }
}