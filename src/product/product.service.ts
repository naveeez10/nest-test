import { Injectable } from '@nestjs/common';
import { ProductRequestDTO } from './ProductRequestDTO';
import ProductResponseDTO from './ProductResponseDTO';

@Injectable()
export class ProductService {
  private products = [];
  addProduct(request: ProductRequestDTO) {
    this.products.push({ id: '1', ...request });
    return { id: '1', ...request };
  }

  getProducts(): ProductResponseDTO[] {
    return this.products;
  }
}
