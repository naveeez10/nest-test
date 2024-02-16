import { INestApplication, ValidationPipe } from '@nestjs/common';
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
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
  });

  afterEach(async () => {
    await prismaService.order.deleteMany();
    await prismaService.product.deleteMany();
  });

  it('/order POST', async () => {
    const createdProduct = await prismaService.product.create({
      data: {
        productName: 'product1',
        price: 100,
      },
    });
    const response = await request(app.getHttpServer())
      .post('/order')
      .send({
        productId: createdProduct.id,
        quantity: 1,
      })
      .expect(201);

    expect(response.body).toMatchObject({
      id: expect.any(Number),
      product: createdProduct,
      quantity: 1,
    });

    await prismaService.order
      .findMany({ include: { product: true } })
      .then((orders) => {
        expect(orders).toMatchObject([
          {
            id: expect.any(Number),
            product: createdProduct,
            quantity: 1,
          },
        ]);
      });
  });

  it('/order GET', async () => {
    const response = await request(app.getHttpServer())
      .get('/order')
      .expect(200);

    const expectedResponse = [];

    expect(response.body).toMatchObject(expectedResponse);
  });

  it('/order POST should return status code 400 when product does not exist', async () => {
    const response = await request(app.getHttpServer())
      .post('/order')
      .send({
        productId: 1,
        quantity: 1,
      })
      .expect(400);

    expect(response.body).toMatchObject({
      statusCode: 400,
      message: 'Product not found',
      error: 'Bad Request',
    });
  });
});
