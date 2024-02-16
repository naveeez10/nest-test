import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';

@Catch()
export class ProductInternalServerErrorException implements ExceptionFilter {
  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}
  catch(exception: unknown, host: ArgumentsHost) {
    const { httpAdapter } = this.httpAdapterHost;
    const ctx = host.switchToHttp();
    let httpStatus: HttpStatus;
    let message: string;

    if (exception instanceof HttpException) {
      httpStatus = exception.getStatus();
      message = exception.message;
    } else {
      httpStatus = HttpStatus.INTERNAL_SERVER_ERROR;
      message = 'Something went wrong! Get back later to buy products! 🛒 ';
    }

    const responseBody = {
      statusCode: httpStatus,
      message: message,
    };

    httpAdapter.reply(ctx.getResponse(), responseBody, httpStatus);
  }
}
