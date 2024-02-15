import { Test, TestingModule } from '@nestjs/testing';
import { OrderService } from './order.service';
import { mockDeep } from 'jest-mock-extended';
import { PrismaService } from '../prisma/prisma.service';

describe('OrderService', () => {
  let service: OrderService;
  const prismaService = mockDeep<PrismaService>();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrderService,
        { provide: PrismaService, useValue: prismaService },
      ],
    }).compile();

    service = module.get<OrderService>(OrderService);
  });

  it('should add order', async () => {
    const request = {
      productId: 1,
      quantity: 1,
    };
    prismaService.order.create.mockResolvedValueOnce({ id: 1, ...request });
    expect(await service.addOrder(request)).toMatchObject({
      id: 1,
      ...request,
    });
    expect(prismaService.order.create).toHaveBeenCalledWith({ data: request });
  });

  it('should get orders', async () => {
    prismaService.order.findMany.mockResolvedValueOnce([]);
    expect(await service.getOrders()).toMatchObject([]);
    expect(prismaService.order.findMany).toHaveBeenCalled();
  });
});
