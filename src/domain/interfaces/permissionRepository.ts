import { DeleteResult } from "typeorm";
import { Role } from "../models/role";
import { Permission } from "../models/permission";

export interface PermissionRepository {
    findById(id: string): Promise<Permission | null>;
    createPermission(permission: Permission): Promise<Permission>;

    updatePermission(permission: Permission, id: string): Promise<Role | null>;
    deletePermission(id: string): Promise<DeleteResult>;
}
