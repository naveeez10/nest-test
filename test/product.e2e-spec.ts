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

  // checks that name of product is string of less than 50 characters
});
