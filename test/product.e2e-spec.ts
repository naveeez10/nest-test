import { INestApplication, ValidationPipe } from '@nestjs/common';
import { AppModule } from '../src/app.module';
import { Test } from '@nestjs/testing';
import * as request from 'supertest';
import { PrismaService } from '../src/prisma/prisma.service';

describe('ProductController (e2e)', () => {
  let app: INestApplication;
  let prismaService: PrismaService;

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    prismaService = moduleFixture.get<PrismaService>(PrismaService);
    await app.init();
  });

  afterEach(async () => {
    await prismaService.product.deleteMany();
  });

  it('Get (/product)', async () => {
    const newProduct = { productName: 'Product A', price: 100 };
    await request(app.getHttpServer())
      .post('/products')
      .send(newProduct)
      .expect(201);

    const expectedResponse = {
      id: expect.any(Number),
      productName: 'Product A',
      price: 100,
    };

    const response = await request(app.getHttpServer())
      .get('/products')
      .expect(200);

    expect(response.body).toMatchObject([expectedResponse]);
  });

  it('Post (/products)', async () => {
    const response = await request(app.getHttpServer())
      .post('/products')
      .send({ productName: 'Product A', price: 100 })
      .expect(201);

    const expectedResponse = {
      id: expect.any(Number),
      productName: 'Product A',
      price: 100,
    };
    expect(response.body).toMatchObject(expectedResponse);
    await prismaService.product.findMany().then((products) => {
      expect(products).toMatchObject([expectedResponse]);
    });
  });

  it('/products (POST) should throw exception when price is not a number', async () => {
    const response = await request(app.getHttpServer())
      .post('/products')
      .send({ productName: 'Product A', price: 'abc' })
      .expect(400);
    expect(response.body).toMatchObject({
      statusCode: 400,
      message: ['Product price must be a number'],
      error: 'Bad Request',
    });
  });

  // create a test for string productName.length < 50 & It should be string
  it('/products (POST) should throw exception when productName is not a string', async () => {
    const response = await request(app.getHttpServer())
      .post('/products')
      .send({ productName: 123, price: 100 })
      .expect(400);
    expect(response.body).toMatchObject({
      statusCode: 400,
      error: 'Bad Request',
    });

    expect(response.body.message).toContain(
      'productName length must be less than 50',
    );
    expect(response.body.message).toContain(
      'productName length must be greater than 1',
    );
    expect(response.body.message).toContain(
      'productName must be a string and length must be less than 50 characters',
    );
  });

  it('/products (POST) should throw exception when length of productName is not greater than 1', async () => {
    const response = await request(app.getHttpServer())
      .post('/products')
      .send({ productName: '', price: 100 })
      .expect(400);
    expect(response.body).toMatchObject({
      statusCode: 400,
      message: ['productName length must be greater than 1'],
      error: 'Bad Request',
    });
  });

  it('/products (POST) should throw exception when length of productName is less than 50', async () => {
    const response = await request(app.getHttpServer())
      .post('/products')
      .send({
        productName: 'artes artibus artifex artis asperiores aspernandumi',
        price: 100,
      })
      .expect(400);
    expect(response.body).toMatchObject({
      statusCode: 400,
      message: ['productName length must be less than 50'],
      error: 'Bad Request',
    });
  });
});
