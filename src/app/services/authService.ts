import { IUserEntity } from "../../domain/entities/IUserEntity";
import { UserRepository } from "../../domain/interfaces/userRepository";
import logger from "../../infrastructure/logger/logger";
import { LoginDTO } from "../dtos/login.dto";
import { UserDTO } from "../dtos/user.dto";
import { User } from "../../domain/models/user";
import bcrypt from "bcrypt";
import { TokenGenerator } from "../utils/generateToken";
import { UserEntity } from "../../infrastructure/entities/userEntity";

export class AuthService {
  constructor(
    private userRepository: UserRepository,
    private encrypt: TokenGenerator,
  ) {}
  async login(loginDTO: LoginDTO): Promise<UserDTO> {
    const userEntity: Partial<IUserEntity> = {
      email: loginDTO.email,
      hashedPassword: loginDTO.password,
    };

    const user: User = await this.userRepository.findByEmail(userEntity.email);
    console.log(
      "🚀 ~ file: authService.ts:42 ~ AuthService ~ login ~ user:",
      user
    );
    if (!user) {
      logger.error(`El usuario con email: ${userEntity.email} no existe`);
      throw new Error("El email o la contraseña son incorrectos");
    }

    const isPasswordValid = await bcrypt.compare(
      userEntity.hashedPassword || "",
      user.hashedPassword
    );
    if (!isPasswordValid) {
      logger.error(`La contraseña del usuario es incorrecta`);
      throw new Error("El email o la contraseña son incorrectos");
    }

    const token = this.encrypt.encrypt({ userId: user.id });
    user.token = token;
    user.lastLogin = new Date();

    const userUpdated = await this.userRepository.updateUser(user.id, user);

    // TODO: se deberia modificar el token y tambien el lastlogin
    return {
      id: userUpdated.id,
      username: userUpdated.username,
      email: userUpdated.email,
      lastLogin: userUpdated.lastLogin,
      token: user.token,
    };
  }
}
