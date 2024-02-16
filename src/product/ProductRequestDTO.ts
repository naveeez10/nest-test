import { IsNumber, IsString, MaxLength, MinLength } from 'class-validator';

export class ProductRequestDTO {
  @IsNumber({}, { message: 'Product price must be a number' })
  price: number;
  @IsString({
    message:
      'productName must be a string and length must be less than 50 characters',
  })
  @MinLength(1, { message: 'productName length must be greater than 1' })
  @MaxLength(50, { message: 'productName length must be less than 50' })
  productName: string;
}
