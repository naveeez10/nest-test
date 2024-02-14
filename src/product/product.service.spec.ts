import { Test, TestingModule } from '@nestjs/testing';
import { ProductService } from './product.service';
import ProductResponseDTO from './ProductResponseDTO';

describe('ProductService', () => {
  let service: ProductService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProductService],
    }).compile();

    service = module.get<ProductService>(ProductService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should add new product', () => {
    const request = {
      price: 420,
      productName: 'Product A',
    };
    expect(service.addProduct(request)).toMatchObject({ id: '1', ...request });
  });

  it('should return empty array', () => {
    expect(service.getProducts()).toMatchObject([]);
  });

  it('should return list of products', () => {
    const request = {
      price: 420,
      productName: 'Product A',
    };
    const addedProduct: ProductResponseDTO = service.addProduct(request);
    expect(service.getProducts()).toMatchObject([addedProduct]);
  });
});
