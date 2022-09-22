// Utilities
import * as bcrypt from 'bcrypt';
// Database App dataSource
import { AppDataSource } from 'src/database/dataSource';
// Data Transfer Object
import { RegisterUserDto } from '../auth/dto';
// Entity
import { User } from './user.entity';

export const UserRepositroy = AppDataSource.manager.getRepository(User).extend({
  /**
   * Create user by register dto
   *
   * @param registerUserDto Register data transfer object
   * @returns Promise<User>
   */
  async createUser(registerUserDto: RegisterUserDto): Promise<User> {
    const user = new User();

    // Salt value
    const salt = await bcrypt.genSalt(10);

    user.username = registerUserDto.username;
    // Hash password with the salt value
    user.password = await bcrypt.hash(registerUserDto.password, salt);
    user.email = registerUserDto.email;

    return user.save();
  },

  /**
   * Get a user by username
   *
   * @param username string
   * @returns Promise<User>
   */
  async getUserByUsername(username: string): Promise<User> {
    return await this.findOneBy({ username });
  },
});
