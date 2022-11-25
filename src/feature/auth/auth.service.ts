// Nest
import {
  Injectable,
  UnauthorizedException,
  NotFoundException,
} from '@nestjs/common';
// Data Transfer Objects
import { LoginUserDto, RegisterUserDto } from './dto';
// Repository
import { User, UserRepository } from '../user';
// JWT Service
import { JwtService } from '@nestjs/jwt';
import { IPayload } from './interfaces/payload.interface';

@Injectable()
export class AuthService {
  constructor(
    private userRepository: UserRepository,
    private jwtService: JwtService,
  ) {}

  /**
   * Register user into the db
   *
   * @param registerUserDto RegisterUserDto
   * @returns User: created user
   */
  async registerUser(registerUserDto: RegisterUserDto): Promise<User> {
    return await this.userRepository.createUser(registerUserDto);
  }

  /**
   * Validate user and return an accessToken
   *
   * @param loginUserDto LoginUserDto
   * @returns accessToken
   */
  async loginUser(
    loginUserDto: LoginUserDto,
  ): Promise<{ accessToken: string }> {
    const { username, password } = loginUserDto;

    // Getting user by username
    const user: User = await this.userRepository.getUserByUsername(username);

    // Making sure if user is valied
    if (!user) throw new NotFoundException('Invalied Credentials');

    // Matching user password with the provided password
    const isMatched: boolean = await user.matchPassword(password);

    if (!isMatched) throw new UnauthorizedException('Invalied Credentials');

    // Signing JWT token with payload
    const payload: IPayload = { username };
    const accessToken: string = await this.jwtService.sign(payload);

    return { accessToken };
  }
}
