// Data Transfer Object
import { RegisterUserDto } from '../auth/dto';
// Entity
import { User } from './user.entity';
// Utilities
import * as bcrypt from 'bcrypt';
import { v4 as uuid } from 'uuid';
import { Repository, DataSource } from 'typeorm';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UserRepository extends Repository<User> {
  constructor(private dataSource: DataSource) {
    super(User, dataSource.createEntityManager());
  }
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

    user._id = uuid();
    user.username = registerUserDto.username;
    // Hash password with the salt value
    user.password = await bcrypt.hash(registerUserDto.password, salt);
    user.email = registerUserDto.email;

    await user.save();

    return user;
  }

  /**
   * Get a user by username
   *
   * @param username string
   * @returns Promise<User>
   */
  async getUserByUsername(username: string): Promise<User> {
    return await this.findOneBy({ username });
  }
}
