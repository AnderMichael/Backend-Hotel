import { DeleteResult } from "typeorm";
import { Role } from "../../domain/models/role";
import logger from '../../infrastructure/logger/logger';
import { AppDataSource } from "../config/dataSource";
import { RoleEntity } from "../entities/roleEntity";
import { PermissionRepository } from "../../domain/interfaces/permissionRepository";
import { Permission } from "../../domain/models/permission";
import { PermissionEntity } from "../entities/permissionEntity";

export class PermissionRepositoryImpl implements PermissionRepository {
    async createPermission(permission: Permission): Promise<Permission> {
        logger.info("En create permission repository")

        const permissionEntity = AppDataSource.getRepository(PermissionEntity).create({
            id: permission.id,
            name: permission.name,
            description: permission.description
        });
        logger.debug(`Respuesta de DB roleEntity ${JSON.stringify(permissionEntity)}`);

        

        const permissionResponse = await AppDataSource.getRepository(PermissionEntity).save(permissionEntity);
        logger.debug(`Respuesta de DB roleResponse ${JSON.stringify(permissionResponse)}`);
        return new Permission({
            id: permission.id,
            name: permission.name,
            description: permission.description
        })
    }
    async updatePermission(permission: Permission, id: string): Promise<Role | null> {
        logger.info("En update permission repository")
        // TODO: set user values 
        const permissionEntity = AppDataSource.getRepository(PermissionEntity).update({id}, permission);
        logger.debug(`Respuesta de DB roleEntity ${JSON.stringify(permissionEntity)}`);
        const permissionAux = await AppDataSource.getRepository(PermissionEntity).findOneBy({ id });
        logger.debug(`Respuesta de DB:${JSON.stringify(permissionAux)}`);
        const permissionResponse = AppDataSource.getRepository(RoleEntity).merge(permissionAux, permission);
        logger.debug(`Respuesta de DB:${JSON.stringify(permissionResponse)}`);
        return permissionResponse? new Role({
            id: permissionResponse.id,
            name: permissionResponse.name,
            description: permissionResponse.description
        }) : null;
    }
    async deletePermission(id: string): Promise<DeleteResult> {
        logger.info("En delete permission repository")
        const permissionEntity = await AppDataSource.getRepository(PermissionEntity).delete({ id });
        logger.debug(`Respuesta de DB:${JSON.stringify(permissionEntity)}`);
        return permissionEntity;
    }
    async findById(id: string): Promise<Permission | null> {
        logger.info("En find by id permission repository")
        const permissionEntity = await AppDataSource.getRepository(PermissionEntity).findOneBy({ id });
        logger.debug(`Respuesta de DB:${JSON.stringify(permissionEntity)}`);
        return permissionEntity ? new Permission(permissionEntity) : null;
    }
}