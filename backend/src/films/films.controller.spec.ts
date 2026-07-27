import { Test, TestingModule } from '@nestjs/testing';
import { FilmsController } from './films.controller';
import { FilmsService } from './films.service';

describe('FilmsController', () => {
  let controller: FilmsController;

  const mockFilmsService = {
    findAll: jest.fn(),
    findOne: jest.fn(),
    findSchedule: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FilmsController],
      providers: [
        {
          provide: FilmsService,
          useValue: mockFilmsService,
        },
      ],
    }).compile();

    controller = module.get<FilmsController>(FilmsController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findAll', () => {
    it('should return films list', async () => {
      const result = { items: [{ id: '1', title: 'Test' }], total: 1 };
      mockFilmsService.findAll.mockResolvedValue(result);

      expect(await controller.findAll()).toBe(result);
      expect(mockFilmsService.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return one film', async () => {
      const result = { items: [{ id: '1', title: 'Test' }], total: 1 };
      mockFilmsService.findOne.mockResolvedValue(result);

      expect(await controller.findOne('1')).toBe(result);
      expect(mockFilmsService.findOne).toHaveBeenCalledWith('1');
    });
  });

  describe('findSchedule', () => {
    it('should return film schedule', async () => {
      const result = { items: [{ id: '1', daytime: '2024-01-01' }], total: 1 };
      mockFilmsService.findSchedule.mockResolvedValue(result);

      expect(await controller.findSchedule('1')).toBe(result);
      expect(mockFilmsService.findSchedule).toHaveBeenCalledWith('1');
    });
  });
});
