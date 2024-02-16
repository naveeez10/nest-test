import { ProductRequestDTO } from './ProductRequestDTO';
import { Test, TestingModule } from '@nestjs/testing';
import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { HttpException } from '@nestjs/common';

describe('ProductRequestDTO', () => {
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [],
    }).compile();
  });

  it('should have valid property values', async () => {
    const productRequest = new ProductRequestDTO();
    productRequest.price = 100;
    productRequest.productName = 'Product A';

    const errors = await validate(productRequest);
    expect(errors.length).toBe(0);
  });

  it('should throw exception when productName is not a string', async () => {
    const productRequest = plainToInstance(ProductRequestDTO, {
      price: 100,
      productName: 49,
    });

    const errors = await validate(productRequest);
    expect(errors.length).toBe(1);
    expect(errors[0].constraints).toMatchObject({
      isString: 'Product name must be a string',
    });
  });

  it('should throw exception when productName is more than 50 characters', async () => {
    const productRequest = plainToInstance(ProductRequestDTO, {
      price: 100,
      productName: 'Product_A'.repeat(10),
    });

    const errors = await validate(productRequest);
    expect(errors.length).toBe(1);
    expect(errors[0].constraints).toMatchObject({
      maxLength: 'Product name must be less than 50 characters',
    });
  });

  it('should throw exception when price is not a number', async () => {
    const productRequest = plainToInstance(ProductRequestDTO, {
      price: '100',
      productName: 'Product A',
    });

    const errors = await validate(productRequest);
    expect(errors.length).toBe(1);
    expect(errors[0].constraints).toMatchObject({
      isNumber: 'Price must be a number',
    });
  });
});
