import { Injectable } from '@nestjs/common';
import { ProductRequestDTO } from './ProductRequestDTO';
import ProductResponseDTO from './ProductResponseDTO';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ProductService {
  constructor(private readonly prismaService: PrismaService) {}
  async addProduct(request: ProductRequestDTO): Promise<ProductResponseDTO> {
    return this.prismaService.product.create({ data: request });
  }

  async getProducts(): Promise<ProductResponseDTO[]> {
    return this.prismaService.product.findMany();
  }
}
