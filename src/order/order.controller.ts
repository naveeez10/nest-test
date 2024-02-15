import { Body, Controller, Post } from '@nestjs/common';
import { OrderRequestDTO } from './orderRequestDTO';
import { OrderService } from './order.service';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  addOrder(@Body() request: OrderRequestDTO) {
    return this.orderService.addOrder(request);
  }
}
