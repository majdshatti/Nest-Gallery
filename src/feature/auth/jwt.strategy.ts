// Nest
import { Injectable, UnauthorizedException } from '@nestjs/common';
// Passport
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
// DataSource
import { AppDataSource } from 'src/database/dataSource';
// Entity
import { User } from '../user';
// Interface
import { IPayload } from './interfaces/payload.interface';

/**
 * JWT Strategy
 * @class
 */
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: 'dabestsecretever',
    });
  }

  async validate(payload: IPayload): Promise<User> {
    const { username } = payload;
    const user = await AppDataSource.getRepository(User).findOneBy({
      username,
    });

    if (!user) throw new UnauthorizedException('Invalied token');

    return user;
  }
}
