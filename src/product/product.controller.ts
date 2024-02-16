import { Body, Controller, Get, Post, UseInterceptors } from '@nestjs/common';
import { ProductRequestDTO } from './ProductRequestDTO';
import ProductResponseDTO from './ProductResponseDTO';
import { ProductService } from './product.service';
import { OrderLoggerInterceptor } from '../interceptors/order-logger.interceptor';

@Controller('products')
// @UseFilters(ProductInternalServerErrorException)
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
