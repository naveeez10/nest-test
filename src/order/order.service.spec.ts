import { Test, TestingModule } from '@nestjs/testing';
import { OrderService } from './order.service';
import { PrismaService } from '../prisma/prisma.service';
import { mockDeep } from 'jest-mock-extended';
import { OrderResponseDTO } from './orderResponseDTO';
import { OrderRequestDTO } from './orderRequestDTO';
import { Product } from '@prisma/client';
import { BadRequestException } from '@nestjs/common';

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

  it('should get empty list when no orders exist', async () => {
    prismaService.order.findMany.mockResolvedValueOnce([]);
    const orders = await service.getOrders();
    expect(orders).toMatchObject([]);
  });

  it('should return all the orders', async () => {
    const productToAdd: Product = {
      id: 1,
      productName: 'test',
      price: 1,
    };
    const orderResponse = [
      {
        id: 1,
        product: productToAdd,
        productId: productToAdd.id,
        quantity: 1,
      },
    ];
    prismaService.order.findMany.mockResolvedValueOnce(orderResponse);
    const response = await service.getOrders();
    expect(prismaService.order.findMany).toHaveBeenCalled();
    expect(response).toMatchObject([
      {
        id: expect.any(Number),
        product: productToAdd,
        quantity: 1,
      },
    ]);
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
    const orderResponse = {
      id: 123,
      product: productToAdd,
      ...request,
    };
    prismaService.order.create.mockResolvedValueOnce(orderResponse);
    prismaService.product.findUnique.mockResolvedValueOnce(productToAdd);
    const response: OrderResponseDTO = await service.addOrder(request);

    const expectedResponse: OrderResponseDTO = {
      id: expect.any(Number),
      product: productToAdd,
      quantity: 1,
    };

    expect(prismaService.order.create).toHaveBeenCalledWith({
      data: request,
      include: { product: true },
    });
    expect(response).toStrictEqual(expectedResponse);
  });

  it('should return error when product not found', async () => {
    //arrange
    const orderToAdd: OrderRequestDTO = {
      productId: 1,
      quantity: 1,
    };

    //action
    const createOrder = service.addOrder(orderToAdd);

    //assert
    expect(prismaService.product.findUnique).toHaveBeenCalledWith({
      where: { id: 1 },
    });
    await expect(createOrder).rejects.toThrow(BadRequestException);
    await expect(createOrder).rejects.toThrow('Product not found');
  });
});
