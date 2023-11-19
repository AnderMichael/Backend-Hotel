import { IUserEntity } from "../../domain/entities/IUserEntity";
import { UserRepository } from "../../domain/interfaces/userRepository";
import { User } from "../../domain/models/user";
import { UserDTO } from "../dtos/user.dto";
import { CreateUserDTO } from "../dtos/create.user.dto";

export class UserService {
  constructor(private userRepository: UserRepository) {}

  async createUser(userDTO: CreateUserDTO): Promise<User> {
    const userEntity: IUserEntity = {
      username: userDTO.username,
      email: userDTO.email,
      hashedPassword: userDTO.password,
    };
    const newUser = new User(userEntity);
    return this.userRepository.createUser(newUser);
  }

  async getUserById(userId: string): Promise<UserDTO | null> {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      return user;
    }

    const userResponse: UserDTO = {
      username: user.username,
      email: user.email,
    };
    return userResponse;
  }

  async updateUserById(
    id: string,
    updatedData: Partial<UserDTO>
  ): Promise<UserDTO | null> {
    const user = await this.userRepository.updateUser(id, updatedData);
    if (!user) {
      return user;
    }

    const userResponse: UserDTO = {
      username: user.username,
      email: user.email,
    };
    return userResponse;
  }

  async deleteUserById(id: string): Promise<void> {
    await this.userRepository.deleteUser(id);
  }
}
