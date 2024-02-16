import { IsNumber } from 'class-validator';

export class ProductRequestDTO {
  @IsNumber({}, { message: 'Product price must be a number' })
  price: number;
  productName: string;
}
