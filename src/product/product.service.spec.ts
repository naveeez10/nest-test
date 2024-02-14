import { Test, TestingModule } from '@nestjs/testing';
import { ProductService } from './product.service';
import ProductResponseDTO from './ProductResponseDTO';
import { PrismaService } from '../prisma/prisma.service';
import { mockDeep } from 'jest-mock-extended';

describe('ProductService', () => {
  let service: ProductService;
  const prismaService = mockDeep<PrismaService>();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductService,
        { provide: PrismaService, useValue: prismaService },
      ],
    }).compile();

    service = module.get<ProductService>(ProductService);
  });

  afterAll(() => {
    prismaService.product.deleteMany();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should add new product', async () => {
    const request = {
      price: 420,
      productName: 'Product A',
    };
    prismaService.product.create.mockResolvedValue({
      id: 1,
      ...request,
    });

    expect(await service.addProduct(request)).toMatchObject({
      id: expect.any(Number),
      ...request,
    });
    expect(prismaService.product.create).toHaveBeenCalledWith({
      data: request,
    });
  });

  it('should return empty array', () => {
    expect(service.getProducts()).toMatchObject([]);
  });

  it('should return list of products', async () => {
    const request = {
      price: 420,
      productName: 'Product A',
    };
    const addedProduct: ProductResponseDTO = await service.addProduct(request);
    expect(service.getProducts()).toMatchObject([addedProduct]);
  });
});
