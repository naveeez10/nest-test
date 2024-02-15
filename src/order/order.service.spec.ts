import { Test, TestingModule } from '@nestjs/testing';
import { OrderService } from './order.service';
import { PrismaService } from '../prisma/prisma.service';
import { mockDeep } from 'jest-mock-extended';
import { OrderResponseDTO } from './orderResponseDTO';
import { OrderRequestDTO } from './orderRequestDTO';

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
    const request: OrderRequestDTO = {
      productId: 1,
      quantity: 1,
    };
    const orderResponse: OrderResponseDTO = {
      id: 123,
      ...request,
    };
    prismaService.order.create.mockResolvedValueOnce(orderResponse);

    const response: OrderResponseDTO = await service.addOrder(request);

    expect(prismaService.order.create).toHaveBeenCalledWith({ data: request });
    expect(response).toMatchObject({
      id: expect.any(Number),
      ...request,
    });
  });
});
