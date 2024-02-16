import { INestApplication } from '@nestjs/common';
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

  it('Post (/products) - should throw exception if price is not a number', async () => {
    const productToAdd = { productName: 'Product A', price: '100' };

    const response = await request(app.getHttpServer())
      .post('/products')
      .send(productToAdd)
      .expect(400);

    expect(response.body).toMatchObject({
      statusCode: 400,
      message: ['Price must be a number'], // class validator pipe returns error message in array [ref: ProductRequestDTO & ProductController]
      error: 'Bad Request',
    });
  });

  it('Post (/products) - should throw exception if productName is not a string', async () => {
    const productToAdd = {
      productName: 10,
      price: 100,
    };

    const response = await request(app.getHttpServer())
      .post('/products')
      .send(productToAdd)
      .expect(400);

    expect(response.body).toMatchObject({
      statusCode: 400,
      error: 'Bad Request',
    });
    expect(response.body.message).toContain('Product name must be a string');
  });

  it('Post (/products) - should throw exception if productName is not a string of less than 50 characters', async () => {
    const productToAdd = {
      productName: 'Product_A'.repeat(10),
      price: 100,
    };

    const response = await request(app.getHttpServer())
      .post('/products')
      .send(productToAdd)
      .expect(400);

    expect(response.body).toMatchObject({
      statusCode: 400,
      message: ['Product name must be less than 50 characters'],
      error: 'Bad Request',
    });
  });
});
