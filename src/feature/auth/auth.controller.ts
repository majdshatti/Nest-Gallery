import { Controller, Post, Body } from '@nestjs/common';
// Entity
import { User } from '../user';
// Service
import { AuthService } from './auth.service';
// Data Transfer Objects
import { LoginUserDto, RegisterUserDto } from './dto/';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  /**
   * Register a user
   *
   * @route POST /auth/register
   * @param registerUserDto RegisterUserDto
   * @returns //TODO
   */
  @Post('/register')
  async registerUser(@Body() registerUserDto: RegisterUserDto): Promise<User> {
    return await this.authService.registerUser(registerUserDto);
  }

  /**
   * Login a user
   *
   * @route POST /auth/login
   * @param loginUserDto LoginUserDto
   * @returns //TODO
   */
  @Post('/login')
  async loginUser(@Body() loginUserDto: LoginUserDto) {
    return await this.authService.loginUser(loginUserDto);
  }
}
