import { Body, Controller, Get, Post, UseFilters } from '@nestjs/common';
import { OrderRequestDTO } from './orderRequestDTO';
import { OrderService } from './order.service';
import { AllExceptionsFilterFilter } from '../allExceptionsFilter.filter';

@Controller('order')
// @UseFilters(AllExceptionsFilterFilter)
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
