import { Test, TestingModule } from '@nestjs/testing';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { OrderDto } from './dto/order.dto';

describe('OrderController', () => {
  let controller: OrderController;
  let service: OrderService;

  const mockOrderService = {
    createOrder: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrderController],
      providers: [
        {
          provide: OrderService,
          useValue: mockOrderService,
        },
      ],
    }).compile();

    controller = module.get<OrderController>(OrderController);
    service = module.get<OrderService>(OrderService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create an order', async () => {
      const dto: OrderDto = {
        email: 'test@test.com',
        phone: '+79999999999',
        tickets: [
          {
            film: 'film-id',
            session: 'session-id',
            daytime: '2024-01-01',
            day: '',
            time: '',
            row: 1,
            seat: 2,
            price: 350,
          },
        ],
      };

      const result = {
        items: [{ id: 'order-id', ...dto.tickets[0] }],
        total: 1,
      };
      mockOrderService.createOrder.mockResolvedValue(result);

      expect(await controller.create(dto)).toBe(result);
      expect(mockOrderService.createOrder).toHaveBeenCalledWith(dto);
    });
  });
});
