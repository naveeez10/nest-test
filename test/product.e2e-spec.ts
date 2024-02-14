import { INestApplication } from '@nestjs/common';
import { AppModule } from '../src/app.module';
import { Test } from '@nestjs/testing';
import * as request from 'supertest';

describe('ProductController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('Get (/product)', async () => {
    const newProduct = { productName: 'Product A', price: 100 };
    await request(app.getHttpServer())
      .post('/products')
      .send(newProduct)
      .expect(201);
    const response = await request(app.getHttpServer())
      .get('/products')
      .expect(200);

    expect(response.body).toMatchObject([newProduct]);
  });

  it('Post (/products)', async () => {
    const response = await request(app.getHttpServer())
      .post('/products')
      .send({ productName: 'Product A', price: 100 })
      .expect(201);

    expect(response.body).toMatchObject({
      id: '1',
      productName: 'Product A',
      price: 100,
    });
  });
});
