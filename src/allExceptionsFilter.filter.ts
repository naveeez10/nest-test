import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';

@Catch()
export class AllExceptionsFilterFilter implements ExceptionFilter {
  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  catch(exception: unknown, host: ArgumentsHost): void {
    const { httpAdapter } = this.httpAdapterHost;

    const ctx = host.switchToHttp();

    let statusCode: HttpStatus;
    let responseMessage: string;

    if (exception instanceof HttpException) {
      statusCode = exception.getStatus();
      responseMessage = exception.message;
    } else {
      statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
      responseMessage = 'Something went wrong. Please try again later.';
    }

    const responseBody = {
      statusCode: statusCode,
      message: responseMessage,
    };

    httpAdapter.reply(ctx.getResponse(), responseBody, responseBody.statusCode);
  }
}
