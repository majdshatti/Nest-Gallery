// Nest
import { Injectable, UnauthorizedException } from '@nestjs/common';
// Passport
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
// Entity
import { User, UserRepository } from '../user';
// Interface
import { IPayload } from './interfaces/payload.interface';

/**
 * JWT Strategy
 * @class
 */
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private userRepository: UserRepository) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: 'dabestsecretever',
    });
  }

  async validate(payload: IPayload): Promise<User> {
    const { username } = payload;
    const user = await this.userRepository.findOneBy({
      username,
    });

    if (!user) throw new UnauthorizedException('Invalied token');

    return user;
  }
}
