import { Test, TestingModule } from '@nestjs/testing';
import { OrderService } from './order.service';

describe('OrderService', () => {
  let service: OrderService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OrderService],
    }).compile();

    service = module.get<OrderService>(OrderService);
  });

  it('should add order', () => {
    const request = {
      productID: 1,
      quantity: 1,
    };
    expect(service.addOrder(request)).toMatchObject({
      id: expect.any(Number),
      ...request,
    });
  });
});
