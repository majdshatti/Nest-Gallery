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

  @Post('/register')
  async registerUser(@Body() registerUserDto: RegisterUserDto): Promise<User> {
    return await this.authService.registerUser(registerUserDto);
  }

  @Post('/login')
  async loginUser(@Body() loginUserDto: LoginUserDto) {
    return await this.authService.loginUser(loginUserDto);
  }
}
