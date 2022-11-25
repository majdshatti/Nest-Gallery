import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { WinstonServices } from '../services/winston/winston.service';
//
import { ValidationRequestException } from './bad-request-validation.exception';

@Catch()
export class AppExceptionHandler implements ExceptionFilter {
  private logger: WinstonServices = new WinstonServices();

  catch(exception: any, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    const httpStatus: number = this.getStatusCode(exception);
    const exceptionMessage: string = this.getExceptionMessage(exception);
    const exceptionError: Object = this.getExceptionError(exception);

    this.logger.error(exception.stack);

    response.status(httpStatus).json({
      success: false,
      message: exceptionMessage,
      errors: exceptionError,
    });
  }

  private getStatusCode = (exception: unknown) => {
    return exception instanceof HttpException
      ? exception.getStatus()
      : HttpStatus.INTERNAL_SERVER_ERROR;
  };

  private getExceptionMessage = (exception: unknown) => {
    return exception instanceof HttpException
      ? exception.message
      : 'Internal Server Error';
  };

  private getExceptionError = (exception: unknown): Object => {
    return exception instanceof ValidationRequestException
      ? exception.errors
      : {};
  };
}
