import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import * as request from 'supertest';
import { PrismaService } from '../src/prisma/prisma.service';
import { OrderRequestDTO } from '../src/order/orderRequestDTO';

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
  });

  it('/order GET', async () => {
    const orderRequest: OrderRequestDTO = { productId: 1, quantity: 1 };
    await prismaService.order.create({ data: orderRequest });

    const response = await request(app.getHttpServer())
      .get('/order')
      .expect(200);

    expect(response.body).toMatchObject([
      { id: expect.any(Number), ...orderRequest },
    ]);
  });

  it('/order POST', async () => {
    const response = await request(app.getHttpServer())
      .post('/order')
      .send({
        productId: 1,
        quantity: 1,
      })
      .expect(201);
    expect(response.body).toMatchObject({
      id: expect.any(Number),
      productId: 1,
      quantity: 1,
    });

    const expectedResponse = {
      id: expect.any(Number),
      productId: 1,
      quantity: 1,
    };

    expect(await prismaService.order.findMany()).toMatchObject([
      expectedResponse,
    ]);
  });
});
