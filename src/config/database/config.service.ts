import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

/**
 * Service dealing with database config based operations.
 *
 * @class
 */
@Injectable()
export class DbConfigService {
  constructor(private configService: ConfigService) {}

  get host(): string {
    return this.configService.get<string>('database.host');
  }
  get port(): number {
    return Number(this.configService.get<number>('database.port'));
  }
  get username(): string {
    return this.configService.get<string>('database.username');
  }
  get password(): string {
    return this.configService.get<string>('database.password');
  }
  get name(): string {
    return this.configService.get<string>('database.name');
  }
}
