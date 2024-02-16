import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  Logger,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger(LoggingInterceptor.name);
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      tap((data) =>
        // console.log(
        //   `Order created with product: ${data.product.productName} and quantity: ${data.quantity}`,
        // ),
        this.logger.log(
          `Order created with product: ${data.product.productName} and quantity: ${data.quantity}`,
        ),
      ),
    );
  }
}
