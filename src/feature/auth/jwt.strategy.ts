import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AppDataSource } from 'src/database/dataSource';
import { IPayload } from './interfaces/payload.interface';
import { User } from '../user';

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
