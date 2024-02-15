import { Test, TestingModule } from '@nestjs/testing';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { mockDeep } from 'jest-mock-extended';
import { OrderRequestDTO } from './orderRequestDTO';
import { Product } from '@prisma/client';
import { OrderResponseDTO } from './orderResponseDTO';

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

  it('should get empty list when no orders exist', async () => {
    service.getOrders.mockResolvedValueOnce([]);
    const response = await controller.getOrders();
    expect(service.getOrders).toHaveBeenCalled();
    expect(response).toMatchObject([]);
  });

  it('should get all orders', async () => {
    const existingProduct: Product = {
      id: 1,
      productName: 'test',
      price: 1,
    };
    const orderToAdded: OrderResponseDTO = {
      id: 1,
      product: existingProduct,
      quantity: 1,
    };
    service.getOrders.mockResolvedValueOnce([orderToAdded]);

    const response = await controller.getOrders();
    expect(service.getOrders).toHaveBeenCalled();
    expect(response).toMatchObject([orderToAdded]);
  });

  it('should add order', async () => {
    const productToAdd: Product = {
      id: 1,
      productName: 'test',
      price: 1,
    };

    const request: OrderRequestDTO = {
      productId: productToAdd.id,
      quantity: 1,
    };

    const mockedOrderResponse = {
      id: 1,
      product: productToAdd,
      quantity: 1,
    };

    const expectedResponse: OrderResponseDTO = {
      id: expect.any(Number),
      product: productToAdd,
      quantity: 1,
    };

    service.addOrder.mockResolvedValueOnce(mockedOrderResponse);
    const response = await controller.addOrder(request);

    expect(service.addOrder).toHaveBeenCalledWith(request);
    expect(response).toStrictEqual(expectedResponse);
  });
});
