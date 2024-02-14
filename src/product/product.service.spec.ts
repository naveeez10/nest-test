import { Test, TestingModule } from '@nestjs/testing';
import { ProductService } from './product.service';

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
});
