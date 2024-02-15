import { Injectable } from '@nestjs/common';
import { OrderRequestDTO } from './orderRequestDTO';
import { OrderResponseDTO } from './orderResponseDTO';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class OrderService {
  constructor(private readonly prismaService: PrismaService) {}
  async addOrder(request: OrderRequestDTO): Promise<OrderResponseDTO> {
    return this.prismaService.order.create({ data: request });
  }

  async getOrders(): Promise<OrderResponseDTO[]> {
    return this.prismaService.order.findMany();
  }
}
