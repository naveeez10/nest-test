import { Test, TestingModule } from '@nestjs/testing';
import { ProductController } from './product.controller';

describe('ProductController', () => {
  let controller: ProductController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductController],
    }).compile();

    controller = module.get<ProductController>(ProductController);
  });

  it('should return empty array', () => {
    expect(controller.getProducts()).toMatchObject([]);
  });
  it('should add a new product', () => {
    expect(
      controller.addProduct({
        price: 420,
        productName: 'Product A',
      }),
    ).toMatchObject({ productName: 'Product A', price: 420, id: '1' });
  });

  it('should return list of products', () => {
    const request = {
      price: 420,
      productName: 'Product A',
    };
    controller.addProduct(request);
    expect(controller.getProducts()).toMatchObject([{ id: '1', ...request }]);
  });
});
