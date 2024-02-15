import { Injectable } from '@nestjs/common';
import { OrderRequestDTO } from './orderRequestDTO';
import { OrderResponseDTO } from './orderResponseDTO';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class OrderService {
  constructor(private readonly prismaService: PrismaService) {}
  async addOrder(request: OrderRequestDTO): Promise<OrderResponseDTO> {
    const addedOrder = await this.prismaService.order.create({
      data: request,
      include: { product: true },
    });
    return {
      id: addedOrder.id,
      quantity: addedOrder.quantity,
      product: addedOrder.product,
    };
  }

  async getOrders(): Promise<OrderResponseDTO[]> {
    const orders = await this.prismaService.order.findMany({
      include: { product: true },
    });
    return orders.map((order) => ({
      id: order.id,
      quantity: order.quantity,
      product: order.product,
    }));
  }
}
