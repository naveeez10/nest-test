import { ProductRequestDTO } from './ProductRequestDTO';
import { plainToInstance } from 'class-transformer';
import { validate, ValidationError } from 'class-validator';

describe('ProductService', () => {
  it('should throw errors when provided productName is a number', async () => {
    const productRequest = { productName: 123, price: 100 };

    const productRequestDTO: ProductRequestDTO = plainToInstance(
      ProductRequestDTO,
      productRequest,
    );

    const errors: ValidationError[] = await validate(productRequestDTO);
    expect(errors.length).not.toBe(0);
    const constraints = errors[0].constraints;
    const expectedResponse = {
      maxLength: 'productName length must be less than 50',
      minLength: 'productName length must be greater than 1',
      isString:
        'productName must be a string and length must be less than 50 characters',
    };
    expect(constraints).toStrictEqual(expectedResponse);
  });

  it('should throw errors when provided length of productName greater than 50', async () => {
    const productRequest = {
      productName: 'artes artibus artifex artis asperiores aspernandumi',
      price: 100,
    };

    const productRequestDTO: ProductRequestDTO = plainToInstance(
      ProductRequestDTO,
      productRequest,
    );

    const errors: ValidationError[] = await validate(productRequestDTO);
    expect(errors.length).not.toBe(0);
    const constraints = errors[0].constraints;
    const expectedResponse = {
      maxLength: 'productName length must be less than 50',
    };
    expect(constraints).toStrictEqual(expectedResponse);
  });

  it('should throw errors when provided length of productName less than 1', async () => {
    const productRequest = {
      productName: '',
      price: 100,
    };

    const productRequestDTO: ProductRequestDTO = plainToInstance(
      ProductRequestDTO,
      productRequest,
    );

    const errors: ValidationError[] = await validate(productRequestDTO);
    expect(errors.length).not.toBe(0);
    const constraints = errors[0].constraints;
    const expectedResponse = {
      minLength: 'productName length must be greater than 1',
    };
    expect(constraints).toStrictEqual(expectedResponse);
  });
});
