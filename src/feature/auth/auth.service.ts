// Nest
import {
  Injectable,
  UnauthorizedException,
  NotFoundException,
} from '@nestjs/common';
// Data Transfer Objects
import { LoginUserDto, RegisterUserDto } from './dto';
// Repository
import { User, UserRepositroy } from '../user';
// JWT Service
import { JwtService } from '@nestjs/jwt';
import { IPayload } from './interfaces/payload.interface';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  async registerUser(registerUserDto: RegisterUserDto): Promise<User> {
    return await UserRepositroy.createUser(registerUserDto);
  }

  async loginUser(
    loginUserDto: LoginUserDto,
  ): Promise<{ accessToken: string }> {
    const { username, password } = loginUserDto;
    const user: User = await UserRepositroy.getUserByUsername(username);

    if (!user) throw new NotFoundException('Invalied Credentials');

    const isMatched: boolean = await user.matchPassword(password);

    if (!isMatched) throw new UnauthorizedException('Invalied Credentials');

    const payload: IPayload = { username };
    const accessToken: string = await this.jwtService.sign(payload);

    return { accessToken };
  }
}
