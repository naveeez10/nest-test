import { Body, Controller, Get, Post } from '@nestjs/common';
import { ProductRequestDTO } from './ProductRequestDTO';
import ProductResponseDTO from './ProductResponseDTO';

@Controller('products')
export class ProductController {
  private products = [];
  @Get()
  getProducts() {
    return this.products;
  }
  @Post()
  addProduct(@Body() request: ProductRequestDTO): ProductResponseDTO {
    this.products.push({ id: '1', ...request });
    return { id: '1', ...request };
  }
}
