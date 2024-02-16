import { Body, Controller, Get, Post, UseInterceptors } from '@nestjs/common';
import { OrderRequestDTO } from './orderRequestDTO';
import { OrderService } from './order.service';
import { OrderLoggerInterceptor } from '../interceptors/order-logger.interceptor';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  @UseInterceptors(OrderLoggerInterceptor)
  addOrder(@Body() request: OrderRequestDTO) {
    return this.orderService.addOrder(request);
  }

  @Get()
  getOrders() {
    return this.orderService.getOrders();
  }
}
