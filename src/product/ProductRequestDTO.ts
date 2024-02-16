import { IsNumber, IsString, MaxLength } from 'class-validator';

export class ProductRequestDTO {
  @IsNumber({}, { message: 'Price must be a number' })
  price: number;

  @IsString({ message: 'Product name must be a string' })
  @MaxLength(50, { message: 'Product name must be less than 50 characters' })
  productName: string;
}
