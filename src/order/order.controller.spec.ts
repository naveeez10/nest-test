import { Test, TestingModule } from '@nestjs/testing';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { mockDeep } from 'jest-mock-extended';

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

  it('should add order', async () => {
    const request = {
      productId: 1,
      quantity: 1,
    };
    service.addOrder.mockResolvedValueOnce({ id: 1, ...request });
    expect(await controller.addOrder(request)).toMatchObject({
      id: expect.any(Number),
      ...request,
    });
    expect(service.addOrder).toHaveBeenCalledWith(request);
  });
});
