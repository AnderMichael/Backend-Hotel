import { IUserEntity } from "../../domain/entities/IUserEntity";
import { UserRepository } from "../../domain/interfaces/userRepository";
import { User } from "../../domain/models/user";
import { UserDTO } from "../dtos/user.dto";
import { CreateUserDTO } from "../dtos/create.user.dto";
import logger from "../../infrastructure/logger/logger"; // Add this import

export class UserService {
  constructor(private userRepository: UserRepository) {}

  async createUser(userDTO: CreateUserDTO): Promise<User> {
    try {
      const userEntity: Partial<IUserEntity> = {
        username: userDTO.username,
        email: userDTO.email,
        hashedPassword: userDTO.password,
        createdAt: new Date(),
        modifiedAt: new Date(),
        lastLogin: null,
      };
      const newUser = new User(userEntity);
      const createdUser = await this.userRepository.createUser(newUser);

      logger.info(`User created successfully in UserService: ${createdUser.id}`);
      return createdUser;
    } catch (error) {
      logger.error("Error creating user in UserService:", error);
      throw new Error("Internal Server Error");
    }
  }

  async getUserById(userId: string): Promise<UserDTO | null> {
    try {
      const user = await this.userRepository.findById(userId);
      if (!user) {
        return user;
      }

      const userResponse: UserDTO = {
        username: user.username,
        email: user.email,
        createdAt: user.createdAt,
        modifiedAt: user.modifiedAt,
        lastLogin: user.lastLogin,
      };

      logger.info(`User retrieved successfully in UserService: ${userResponse.username}`);
      return userResponse;
    } catch (error) {
      logger.error(`Error getting user by ID ${userId} in UserService:`, error);
      throw new Error("Internal Server Error");
    }
  }

  async updateUserById(
    id: string,
    updatedData: Partial<UserDTO>
  ): Promise<UserDTO | null> {
    try {
      logger.debug(`Attempting to update user with ID: ${id} in UserService`);
      const user = await this.userRepository.updateUser(id, updatedData);
      if (!user) {
        return user;
      }

      const userResponse: UserDTO = {
        username: user.username,
        email: user.email,
        createdAt: user.createdAt,
        modifiedAt: user.modifiedAt,
        lastLogin: user.lastLogin,
      };

      logger.info(`User with ID: ${id} updated successfully in UserService`);
      return userResponse;
    } catch (error) {
      logger.error(`Error updating user with ID ${id} in UserService:`, error);
      throw new Error("Internal Server Error");
    }
  }

  async deleteUserById(id: string): Promise<void> {
    try {
      logger.debug(`Attempting to delete user with ID: ${id} in UserService`);
      await this.userRepository.deleteUser(id);
      logger.info(`User with ID: ${id} deleted successfully in UserService`);
    } catch (error) {
      logger.error(`Error deleting user with ID ${id} in UserService:`, error);
      throw new Error("Internal Server Error");
    }
  }
}
