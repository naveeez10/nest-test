import { Body, Controller, Get, Post } from '@nestjs/common';
import { OrderRequestDTO } from './orderRequestDTO';
import { OrderService } from './order.service';
import { OrderResponseDTO } from './orderResponseDTO';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  addOrder(@Body() request: OrderRequestDTO) {
    return this.orderService.addOrder(request);
  }

  @Get()
  getOrders() {
    return this.orderService.getOrders();
  }
}
