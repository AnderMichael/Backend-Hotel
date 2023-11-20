import {RoleRepositoryImpl} from "../../infrastructure/repositories/roleRepository";
import {RoleService} from "../../app/services/roleService";
import {RoleController} from "./roleController";
import {HotelController} from "./hotelController";
import {HotelService} from "../../app/services/hotelService";
import {HotelRepositoryImpl} from "../../infrastructure/repositories/hotelRepositoryImpl";
import {RoomRepositoryImpl} from "../../infrastructure/repositories/roomRepositoryImpl";
import {RoomService} from "../../app/services/roomService";
import {RoomController} from "./roomController";
import {Router} from "express";
import {PermissionRepositoryImpl} from "../../infrastructure/repositories/permissionRepositoryImpl";
import {PermissionService} from "../../app/services/permissionService";
import {PermissionController} from "./permissionController";

const API: string = "/api";

class EncryptImpl {
}

const encrypt = new EncryptImpl();
const roleRepository = new RoleRepositoryImpl();
const roleService = new RoleService(roleRepository);
const roleController = new RoleController(roleService);
const hotelRepository = new HotelRepositoryImpl()
const hotelService = new HotelService(hotelRepository);
const hotelController = new HotelController(hotelService);
const roomRepository = new RoomRepositoryImpl()
const roomService = new RoomService(roomRepository, hotelRepository);
const roomController = new RoomController(roomService);
const permissionRepository = new PermissionRepositoryImpl()
const permissionService = new PermissionService(permissionRepository);
const permissionController = new PermissionController(permissionService);

    export const routes = (server: any) => {
        server.use('${API}/roles', permissionController.router);
        server.use('${API}/hotel', hotelController.router);
        server.use('${API}/room', roomController.router);
        server.use('/${API}roles', roleController.router);

};