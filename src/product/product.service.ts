import { Injectable } from '@nestjs/common';
import { ProductRequestDTO } from './ProductRequestDTO';
import ProductResponseDTO from './ProductResponseDTO';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ProductService {
  private products: ProductResponseDTO[] = [];
  constructor(private readonly prismaService: PrismaService) {}
  async addProduct(request: ProductRequestDTO): Promise<ProductResponseDTO> {
    this.products.push({ id: 1, ...request });
    return this.prismaService.product.create({ data: request });
  }

  getProducts(): ProductResponseDTO[] {
    return this.products;
  }
}
