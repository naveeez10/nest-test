import { Test, TestingModule } from '@nestjs/testing';
import { OrderService } from './order.service';
import { mockDeep } from 'jest-mock-extended';
import { PrismaService } from '../prisma/prisma.service';
import { ProductRequestDTO } from '../product/ProductRequestDTO';
import { OrderRequestDTO } from './orderRequestDTO';
import { OrderResponseDTO } from './orderResponseDTO';
import { Product } from '@prisma/client';

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
    prismaService.order.create.mockResolvedValueOnce(createdOrder);
    expect(await service.addOrder(request)).toMatchObject({
      id: 1,
      quantity: request.quantity,
      product: {
        id: 1,
        productName: 'productA',
        price: 100,
      },
    });
    expect(prismaService.order.create).toHaveBeenCalledWith({
      data: request,
      include: { product: true },
    });
  });

  it('should get orders', async () => {
    const product: Product = { id: 1, productName: 'product', price: 100 };
    const order = {
      id: 1,
      quantity: 1,
      productId: 1,
      product,
    };
    prismaService.order.findMany.mockResolvedValueOnce([order]);

    expect(await service.getOrders()).toMatchObject([
      {
        id: order.id,
        quantity: order.quantity,
        product: order.product,
      },
    ]);
    expect(prismaService.order.findMany).toHaveBeenCalled();
  });
});
