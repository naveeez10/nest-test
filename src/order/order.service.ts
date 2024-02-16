import { BadRequestException, Injectable } from '@nestjs/common';
import { OrderRequestDTO } from './orderRequestDTO';
import { OrderResponseDTO } from './orderResponseDTO';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class OrderService {
  constructor(private readonly prismaService: PrismaService) {}
  async addOrder(request: OrderRequestDTO): Promise<OrderResponseDTO> {
    await this.verifyProductExists(request.productId);
    const addedOrder = await this.prismaService.order.create({
      data: request,
      include: { product: true },
    });
    return this.transformResponse(addedOrder);
  }

  async getOrders(): Promise<OrderResponseDTO[]> {
    const orders = await this.prismaService.order.findMany({
      include: { product: true },
    });
    return orders.map((order) => this.transformResponse(order));
  }

  private transformResponse(addedOrder) {
    return {
      id: addedOrder.id,
      quantity: addedOrder.quantity,
      product: addedOrder.product,
    };
  }
  private async verifyProductExists(productId: number) {
    const product = await this.prismaService.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      throw new BadRequestException('Product not found');
    }
  }
}
