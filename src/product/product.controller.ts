import { Body, Controller, Get, Post } from '@nestjs/common';
import { ProductRequestDTO } from './ProductRequestDTO';
import ProductResponseDTO from './ProductResponseDTO';

@Controller('products')
export class ProductController {
  @Get()
  getProducts() {
    return [];
  }

  @Post()
  addProduct(@Body() request: ProductRequestDTO): ProductResponseDTO {
    return { id: '1', ...request };
  }
}
