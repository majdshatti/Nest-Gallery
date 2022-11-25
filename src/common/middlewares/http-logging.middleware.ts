import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { WinstonServices } from '../services/winston/winston.service';

@Injectable()
export class HttpLoggerMiddleware implements NestMiddleware {
  private logger = new WinstonServices();

  use(request: Request, response: Response, next: NextFunction): void {
    const { ip, method, originalUrl } = request;
    const userAgent = request.get('user-agent') || '';

    response.on('finish', () => {
      const { statusCode } = response;
      const contentLength = response.get('content-length');

      this.logger.info(
        `${method} ${statusCode} ${originalUrl} - ${contentLength} - ${userAgent} ${ip}`,
      );
    });

    next();
  }
}
