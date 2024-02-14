import { Test, TestingModule } from '@nestjs/testing';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { mockDeep } from 'jest-mock-extended';
import { ProductRequestDTO } from './ProductRequestDTO';

describe('ProductController', () => {
  let controller: ProductController;
  const service = mockDeep<ProductService>();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductController],
      providers: [{ provide: ProductService, useValue: service }],
    }).compile();

    controller = module.get<ProductController>(ProductController);
  });

  it('should return empty array', () => {
    service.getProducts.mockReturnValue([]);
    expect(controller.getProducts()).toMatchObject([]);
    expect(service.getProducts).toHaveBeenCalled();
  });
  it('should add a new product', () => {
    service.addProduct.mockReturnValue({
      id: '1',
      productName: 'Product A',
      price: 420,
    });

    const requestedProduct: ProductRequestDTO = {
      price: 420,
      productName: 'Product A',
    };
    expect(controller.addProduct(requestedProduct)).toMatchObject({
      productName: 'Product A',
      price: 420,
      id: '1',
    });

    expect(service.addProduct).toHaveBeenCalledWith(requestedProduct);
  });

  it('should return list of products', () => {
    const request = {
      price: 420,
      productName: 'Product A',
    };
    service.getProducts.mockReturnValue([{ id: '1', ...request }]);
    controller.addProduct(request);
    expect(controller.getProducts()).toMatchObject([{ id: '1', ...request }]);
    expect(service.getProducts).toHaveBeenCalled();
  });
});
