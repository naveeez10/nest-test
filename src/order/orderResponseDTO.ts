import { Product } from '@prisma/client';

export interface OrderResponseDTO {
  id: number;
  quantity: number;
  product: Product;
}
