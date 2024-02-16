import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';

@Injectable()
export class OrderLoggerInterceptor implements NestInterceptor {
  private readonly logger = new Logger(OrderLoggerInterceptor.name);
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next
      .handle()
      .pipe(
        tap((data) =>
          this.logger.log(
            `Order created with ProductName: ${data.product.productName} & Quantity: ${data.quantity} 🎉`,
          ),
        ),
      );
  }
}
