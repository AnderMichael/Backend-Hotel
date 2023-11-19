import { IUserEntity } from "../../domain/entities/IUserEntity";
import { UserRepository } from "../../domain/interfaces/userRepository";
import logger from "../../infrastructure/logger/logger";
import { LoginDTO } from "../dtos/login.dto";
import { UserDTO } from "../dtos/user.dto";
import { User } from "../../domain/models/user";
import bcrypt from "bcrypt";
import { TokenGenerator } from "../utils/generateToken";

export class AuthService {
  constructor(
    private userRepository: UserRepository,
    private encrypt: TokenGenerator
  ) {}

  async login(loginDTO: LoginDTO): Promise<UserDTO> {
    try {
      const userEntity: Partial<IUserEntity> = {
        email: loginDTO.email,
        hashedPassword: loginDTO.password,
      };

      const user: User = await this.userRepository.findByEmail(userEntity.email);

      if (!user) {
        logger.error(`User with email ${userEntity.email} does not exist`);
        throw new Error("Email or password is incorrect");
      }

      const isPasswordValid = await bcrypt.compare(
        userEntity.hashedPassword || "",
        user.hashedPassword
      );

      if (!isPasswordValid) {
        logger.error(`Incorrect password for user with email ${userEntity.email}`);
        throw new Error("Email or password is incorrect");
      }

      const token = this.encrypt.encrypt({ userId: user.id });
      user.token = token;
      user.lastLogin = new Date();

      const userUpdated = await this.userRepository.updateUser(user.id, user);

      return {
        id: userUpdated.id,
        username: userUpdated.username,
        email: userUpdated.email,
        lastLogin: userUpdated.lastLogin,
        createdAt: userUpdated.createdAt,
        modifiedAt: userUpdated.modifiedAt,
        token: user.token,
      };
    } catch (error) {
      logger.error(`Error during login: ${error}`);
      throw error;
    }
  }
}
