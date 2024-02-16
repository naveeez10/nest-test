import { Body, Controller, Get, Post, UseInterceptors } from '@nestjs/common';
import { OrderRequestDTO } from './orderRequestDTO';
import { OrderService } from './order.service';
import { LoggingInterceptor } from '../loggingInterceptor.interceptor';

@Controller('order')
// @UseFilters(AllExceptionsFilterFilter)
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  @UseInterceptors(LoggingInterceptor)
  addOrder(@Body() request: OrderRequestDTO) {
    return this.orderService.addOrder(request);
  }

  @Get()
  getOrders() {
    return this.orderService.getOrders();
  }
}
