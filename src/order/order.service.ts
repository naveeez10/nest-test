import { Injectable } from '@nestjs/common';
import { OrderRequestDTO } from './orderRequestDTO';
import { OrderResponseDTO } from './orderResponseDTO';

@Injectable()
export class OrderService {
  addOrder(request: OrderRequestDTO): OrderResponseDTO {
    console.log(request);
    return { id: 1, ...request };
  }
}
