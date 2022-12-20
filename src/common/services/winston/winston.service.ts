import { Injectable } from '@nestjs/common';
import slugify from 'slugify';
import * as winston from 'winston';

@Injectable()
export class WinstonServices {
  private logger: winston.Logger;
  private dateString: string = slugify(new Date(Date.now()).toDateString(), {
    lower: true,
  });

  constructor() {
    this.logger = winston.createLogger({
      transports: [
        new winston.transports.File({
          level: 'error',
          filename: `src/logs/error/${this.dateString}.log`,
        }),
        new winston.transports.Console({
          level: 'info',
          format: winston.format.combine(
            winston.format.colorize(),
            winston.format.simple(),
            winston.format.timestamp(),
          ),
        }),
        new winston.transports.File({
          level: 'debug',
          filename: `src/logs/debug/${this.dateString}.log`,
          format: winston.format.combine(winston.format.json()),
        }),
      ],
    });
  }

  public error(message: string) {
    this.logger.log('error', message);
  }

  public info(message: string) {
    this.logger.log('info', message);
  }

  public debug(message: string) {
    this.logger.debug(message);
  }
}
