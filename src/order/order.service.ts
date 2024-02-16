import { BadRequestException, Injectable } from '@nestjs/common';
import { OrderRequestDTO } from './orderRequestDTO';
import { OrderResponseDTO } from './orderResponseDTO';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class OrderService {
  constructor(private readonly prismaService: PrismaService) {}
  async addOrder(request: OrderRequestDTO): Promise<OrderResponseDTO> {
    await this.verifyProductExists(request.productId);
    const addedOrderResponse = await this.prismaService.order.create({
      data: request,
      include: { product: true },
    });

    return this.transformToResponseDTO(addedOrderResponse);
  }

  private transformToResponseDTO(addedOrderResponse: OrderResponseDTO) {
    return {
      id: addedOrderResponse.id,
      product: addedOrderResponse.product,
      quantity: addedOrderResponse.quantity,
    };
  }

  private async verifyProductExists(productId: number) {
    const existingProduct = await this.prismaService.product.findUnique({
      where: { id: productId },
    });
    if (!existingProduct) {
      throw new BadRequestException('Product not found');
    }
  }

  async getOrders(): Promise<OrderResponseDTO[]> {
    const ordersResponse = this.prismaService.order.findMany({
      include: { product: true },
    });
    return (await ordersResponse).map((order) =>
      this.transformToResponseDTO(order),
    );
  }
}
