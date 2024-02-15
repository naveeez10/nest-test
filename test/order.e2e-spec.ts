import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import * as request from 'supertest';
import { PrismaService } from '../src/prisma/prisma.service';
import { OrderRequestDTO } from '../src/order/orderRequestDTO';
import { Product } from '@prisma/client';
import { ProductRequestDTO } from '../src/product/ProductRequestDTO';
import { OrderResponseDTO } from '../src/order/orderResponseDTO';

describe('OrderController', () => {
  let app: INestApplication;
  let prismaService: PrismaService;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    prismaService = module.get<PrismaService>(PrismaService);
    app = module.createNestApplication();
    await app.init();
  });

  afterEach(async () => {
    await prismaService.order.deleteMany();
    await prismaService.product.deleteMany();
  });

  it('/order GET', async () => {
    const productToCreate: ProductRequestDTO = {
      productName: 'test',
      price: 1,
    };
    const addedProduct: Product = await prismaService.product.create({
      data: productToCreate,
    });
    const orderRequest: OrderRequestDTO = {
      productId: addedProduct.id,
      quantity: 1,
    };

    await prismaService.order.create({
      data: {
        ...orderRequest,
      },
    });

    const response = await request(app.getHttpServer())
      .get('/order')
      .expect(200);

    const expectedResponse: OrderResponseDTO = {
      id: expect.any(Number),
      product: addedProduct,
      quantity: orderRequest.quantity,
    };
    expect(response.body).toStrictEqual([expectedResponse]);
  });

  it('/order POST', async () => {
    const existingProduct = await prismaService.product.create({
      data: {
        productName: 'test',
        price: 1,
      },
    });
    const response = await request(app.getHttpServer())
      .post('/order')
      .send({
        productId: existingProduct.id,
        quantity: 1,
      })
      .expect(201);

    const expectedResponse: OrderResponseDTO = {
      id: expect.any(Number),
      product: existingProduct,
      quantity: 1,
    };
    expect(response.body).toMatchObject(expectedResponse);
    expect(
      await prismaService.order.findMany({ include: { product: true } }),
    ).toMatchObject([expectedResponse]);
  });
});
