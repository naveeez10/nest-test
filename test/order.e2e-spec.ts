import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import * as request from 'supertest';
import { PrismaService } from '../src/prisma/prisma.service';

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

  it('/order POST', async () => {
    const response = await request(app.getHttpServer())
      .post('/order')
      .send({
        productID: 1,
        quantity: 1,
      })
      .expect(201);
    expect(response.body).toMatchObject({
      id: expect.any(Number),
      productID: 1,
      quantity: 1,
    });

    await prismaService.order.findMany().then((orders) => {
      expect(orders).toMatchObject([
        {
          id: expect.any(Number),
          productID: 1,
          quantity: 1,
        },
      ]);
    });
  });
});
