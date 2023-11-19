import { UserRepository } from "../../domain/interfaces/userRepository";
import { User } from "../../domain/models/user";
import { AppDataSource } from "../config/dataSource";
import { UserEntity } from "../entities/userEntity";
import logger from "../logger/logger";
import bcrypt from "bcrypt";

export class UserRepositoryImpl implements UserRepository {
  async findAll(): Promise<User[]> {
    const userRepository = AppDataSource.getRepository(UserEntity);
    const users = await userRepository.find();
    return users.map((client) => new User(client));
  }

  async findById(id: string): Promise<User | null> {
    const userRepository = AppDataSource.getRepository(UserEntity);
    const user = await userRepository.findOne({ where: { id } });
    return user ? new User(user) : null;
  }

  async findByEmail(email: string): Promise<User | null> {
    const userRepository = AppDataSource.getRepository(UserEntity);
    const user = await userRepository.findOne({ where: { email } });
    return user ? new User(user) : null;
  }
  async createUser(user: User): Promise<User> {
    const userRepository = AppDataSource.getRepository(UserEntity);
    try {
      const hashedPassword = bcrypt.hashSync(user.hashedPassword, 10);
      const userEntity = userRepository.create({
        id: user.id,
        username: user.username,
        email: user.email,
        hashedPassword: hashedPassword,
        createdAt: user.createdAt,
        modifiedAt: user.modifiedAt,
        lastLogin: user.lastLogin,
      });

      const userResponse = await userRepository.save(userEntity);

      return new User({
        id: userResponse.id,
        username: userResponse.username,
        email: userResponse.email,
        hashedPassword: userResponse.hashedPassword,
        createdAt: userResponse.createdAt,
        modifiedAt: userResponse.createdAt,
        lastLogin: userResponse.lastLogin,
      });
    } catch (error) {
      logger.error(`Error creating client: ${error}`);
      throw error;
    }
  }

  async deleteUser(id: string): Promise<void> {
    const repository = AppDataSource.getRepository(UserEntity);

    try {
      const user = await repository.findOne({ where: { id } });

      if (!user) {
        throw new Error(
          `userRepository: Error deleting client with ID: ${id}. Client not found.`
        );
      }

      await repository.remove(user);
    } catch (error) {
      logger.error(`Error deleting client: ${error}`);
      throw error;
    }
  }

  async updateUser(userId: string, updateData: Partial<User>): Promise<User> {
    const repository = AppDataSource.getRepository(UserEntity);
    try {
      const user = await repository.findOne({ where: { id: userId } });

      if (!user) {
        throw new Error(
          `userRepository: Error updating client with ID: ${userId}. Client not found.`
        );
      }
      updateData.modifiedAt = new Date();
      repository.merge(user, updateData);
      const updatedUser = await repository.save(user);
      return updatedUser;
    } catch (error) {
      logger.error(`Error updating client: ${error}`);
      throw error;
    }
  }
}
