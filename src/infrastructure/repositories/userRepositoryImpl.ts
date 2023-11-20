import { UserRepository } from "../../domain/interfaces/userRepository";
import { User } from "../../domain/models/user";
import { AppDataSource } from "../config/dataSource";
import { UserEntity } from "../entities/userEntity";
import logger from "../logger/logger";
import bcrypt from "bcrypt";

export class UserRepositoryImpl implements UserRepository {
  async findAll(): Promise<User[]> {
    try {
      logger.info('Finding all users in UserRepositoryImpl');
      const userRepository = AppDataSource.getRepository(UserEntity);
      const users = await userRepository.find();
      return users.map((client) => new User(client));
    } catch (error) {
      logger.error('Error finding all users in UserRepositoryImpl:', error);
      throw new Error('Internal Server Error');
    }
  }

  async findById(id: string): Promise<User | null> {
    try {
      logger.info(`Finding user by ID: ${id} in UserRepositoryImpl`);
      const userRepository = AppDataSource.getRepository(UserEntity);
      const user = await userRepository.findOne({ where: { id } });
      return user ? new User(user) : null;
    } catch (error) {
      logger.error(`Error finding user by ID ${id} in UserRepositoryImpl:`, error);
      throw new Error('Internal Server Error');
    }
  }

  async findByEmail(email: string): Promise<User | null> {
    try {
      logger.info(`Finding user by email: ${email} in UserRepositoryImpl`);
      const userRepository = AppDataSource.getRepository(UserEntity);
      const user = await userRepository.findOne({ where: { email } });
      return user ? new User(user) : null;
    } catch (error) {
      logger.error(`Error finding user by email ${email} in UserRepositoryImpl:`, error);
      throw new Error('Internal Server Error');
    }
  }

  async createUser(user: User): Promise<User> {
    try {
      logger.info('Creating user in UserRepositoryImpl');
      const userRepository = AppDataSource.getRepository(UserEntity);
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
      logger.error('Error creating user in UserRepositoryImpl:', error);
      throw new Error('Internal Server Error');
    }
  }

  async deleteUser(id: string): Promise<void> {
    try {
      logger.debug(`Attempting to delete user with ID: ${id} in UserRepositoryImpl`);
      const repository = AppDataSource.getRepository(UserEntity);
      const user = await repository.findOne({ where: { id } });

      if (!user) {
        logger.error(`Error deleting user with ID ${id} in UserRepositoryImpl: User not found`);
        throw new Error('User not found');
      }

      await repository.remove(user);
      logger.info(`User with ID: ${id} deleted successfully in UserRepositoryImpl`);
    } catch (error) {
      logger.error(`Error deleting user with ID ${id} in UserRepositoryImpl:`, error);
      throw new Error('Internal Server Error');
    }
  }

  async updateUser(userId: string, updateData: Partial<User>): Promise<User> {
    try {
      logger.debug(`Attempting to update user with ID: ${userId} in UserRepositoryImpl`);
      const repository = AppDataSource.getRepository(UserEntity);
      const user = await repository.findOne({ where: { id: userId } });

      if (!user) {
        logger.error(`Error updating user with ID ${userId} in UserRepositoryImpl: User not found`);
        throw new Error('User not found');
      }

      updateData.modifiedAt = new Date();
      repository.merge(user, updateData);
      const updatedUser = await repository.save(user);
      logger.info(`User with ID: ${userId} updated successfully in UserRepositoryImpl`);
      return updatedUser;
    } catch (error) {
      logger.error(`Error updating user with ID ${userId} in UserRepositoryImpl:`, error);
      throw new Error('Internal Server Error');
    }
  }
}
