import { Body, Controller, Get, Post } from '@nestjs/common';
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
  getProducts(): ProductResponseDTO[] {
    return this.service.getProducts();
  }
  @Post()
  async addProduct(
    @Body() request: ProductRequestDTO,
  ): Promise<ProductResponseDTO> {
    return await this.service.addProduct(request);
  }
}
