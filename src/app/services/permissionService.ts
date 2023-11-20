
import { RoleDto } from '../dtos/role.dto';
import logger from '../../infrastructure/logger/logger';
import { PermissionRepository } from "../../domain/interfaces/permissionRepository";
import { PermissionDto } from "../dtos/permission.dto";
import { CreatePermissionDto } from "../dtos/create.permission.dto";
import { IPermissionEntity } from "../../domain/entities/IPermissionEntity";
import { Permission } from "../../domain/models/permission";
import { UpdatePermissionDto } from "../dtos/update.permission.dto";
import {DeletedDTO} from "../dtos/deleted";

export class PermissionService {
    constructor(private permissionRepository: PermissionRepository) { }

    async getPermissionById(id: string): Promise<PermissionDto | null> {

        logger.info("En get permission by id service");
        const permission = await this.permissionRepository.findById(id);
        if (!permission){
            return null
        }
        logger.debug(`Get permission service: Role regresado por repository ${JSON.stringify(permission)}`);

        const permissionResponse: RoleDto = {
            id: permission.id,
            name: permission.name,
            description: permission.description
        }
        return permissionResponse;
    }

    async createPermission(permissionDto: CreatePermissionDto): Promise<PermissionDto> {
        logger.info("En create permission");
        const permissionEntity: IPermissionEntity = {
            name: permissionDto.name,
            description: permissionDto.description
        };
        const newPermission = new Permission(permissionEntity);
        const responsePermission = await this.permissionRepository.createPermission(newPermission);
        logger.debug(`Create role Service: Permission regresado por repository ${JSON.stringify(responsePermission)}`);
        return {id: responsePermission.id, name: responsePermission.name, description: responsePermission.description};
    }

    async updatePermission(permissionDto: UpdatePermissionDto, id: string): Promise<{ name: string; description: string; id: string }> {
        logger.info("En update permission service");
        const backuppermission = await this.permissionRepository.findById(id);
        if (!backuppermission){
            return null
        }
        logger.debug(`Update permission service: Role regresado por repository ${JSON.stringify(backuppermission)}`);
        const permission: Permission = {
            id: backuppermission.id,
            name: (permissionDto.name? permissionDto.name: backuppermission.name),
            description: (permissionDto.description? permissionDto.description:backuppermission.description)
        }
        const responsepermission = await this.permissionRepository.updatePermission(permission, id);
        logger.debug(`Update permission Service: permission regresado por repository ${JSON.stringify(responsepermission)}`);
        return {id: responsepermission.id, name: responsepermission.name, description: responsepermission.description};
    }

    async deletePermission(id: string): Promise<DeletedDTO | null> {

        logger.info("En delete permission by id service");
        const permission = await this.permissionRepository.deletePermission(id);
        if (!permission){
            return null
        }
        logger.debug(`Delete permission service: Mensaje regresado por repository ${JSON.stringify(permission)}`);

        const permissionResponse: DeletedDTO = {
            message: permission.raw as string
        }
        return permissionResponse;
    }
}