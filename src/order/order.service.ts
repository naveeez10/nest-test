import { Injectable } from '@nestjs/common';
import { OrderRequestDTO } from './orderRequestDTO';
import { OrderResponseDTO } from './orderResponseDTO';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class OrderService {
  constructor(private readonly prismaService: PrismaService) {}
  async addOrder(request: OrderRequestDTO): Promise<OrderResponseDTO> {
    const addedOrderResponse = await this.prismaService.order.create({
      data: request,
      include: { product: true },
    });

    return {
      id: addedOrderResponse.id,
      product: addedOrderResponse.product,
      quantity: addedOrderResponse.quantity,
    };
  }

  async getOrders(): Promise<OrderResponseDTO[]> {
    const ordersResponse = this.prismaService.order.findMany({
      include: { product: true },
    });
    return (await ordersResponse).map((order) => {
      return {
        id: order.id,
        product: order.product,
        quantity: order.quantity,
      };
    });
  }
}
