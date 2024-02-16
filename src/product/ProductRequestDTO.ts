import { IsNumber } from 'class-validator';

export class ProductRequestDTO {
  @IsNumber({}, { message: 'Price must be a number' })
  price: number;

  productName: string;
}
