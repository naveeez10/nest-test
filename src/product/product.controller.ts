import { Body, Controller, Get, Post, ValidationPipe } from '@nestjs/common';
import { ProductRequestDTO } from './ProductRequestDTO';
import ProductResponseDTO from './ProductResponseDTO';
import { ProductService } from './product.service';

@Controller('products')
export class ProductController {
  private readonly service: ProductService;
  constructor(service: ProductService) {
    this.service = service;
  }
  @Get()
  async getProducts(): Promise<ProductResponseDTO[]> {
    return await this.service.getProducts();
  }
  @Post()
  async addProduct(
    @Body()
    request: ProductRequestDTO,
  ): Promise<ProductResponseDTO> {
    return await this.service.addProduct(request);
  }
}
