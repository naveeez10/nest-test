import { Test, TestingModule } from '@nestjs/testing';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { mockDeep } from 'jest-mock-extended';
import { Product } from '@prisma/client';

describe('OrderController', () => {
  let controller: OrderController;
  const service = mockDeep<OrderService>();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrderController],
      providers: [OrderService, { provide: OrderService, useValue: service }],
    }).compile();

    controller = module.get<OrderController>(OrderController);
  });

  it('should add order', async () => {
    const request = {
      productId: 1,
      quantity: 1,
    };
    const createdProduct = {
      id: 1,
      productName: 'productA',
      price: 100,
    };
    const createdOrder = {
      id: 1,
      product: createdProduct,
      ...request,
    };
    service.addOrder.mockResolvedValueOnce(createdOrder);
    expect(await controller.addOrder(request)).toMatchObject({
      id: expect.any(Number),
      ...request,
    });
    expect(service.addOrder).toHaveBeenCalledWith(request);
  });

  it('should get orders', async () => {
    const product: Product = { id: 1, productName: 'product', price: 100 };
    const order = {
      id: 1,
      quantity: 1,
      product,
    };
    service.getOrders.mockResolvedValueOnce([order]);
    expect(await controller.getOrders()).toMatchObject([
      {
        id: order.id,
        quantity: order.quantity,
        product: order.product,
      },
    ]);
    expect(service.getOrders).toHaveBeenCalled();
  });
});
