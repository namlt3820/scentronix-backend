import { Test, TestingModule } from '@nestjs/testing';
import { plainToInstance } from 'class-transformer';

import { UrlsBySpecificPriorityController } from './urls-by-specific-priority.controller';
import { UrlsBySpecificPriorityResponse } from './urls-by-specific-priority.response';
import { UrlsBySpecificPriorityService } from './urls-by-specific-priority.service';

describe('UrlsBySpecificPriorityController', () => {
  let controller: UrlsBySpecificPriorityController;
  let service: UrlsBySpecificPriorityService;

  beforeEach(async () => {
    service = { run: jest.fn() } as any;

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UrlsBySpecificPriorityController],
      providers: [
        {
          provide: UrlsBySpecificPriorityService,
          useValue: service,
        },
      ],
    }).compile();

    controller = module.get<UrlsBySpecificPriorityController>(
      UrlsBySpecificPriorityController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('run', () => {
    it('should return data in UrlsBySpecificPriorityResponse format', async () => {
      const priority = 4;
      const mockData = [
        { url: 'https://gitlab.com', priority: 4 },
        { url: 'https://github.com', priority: 4 },
      ];

      (service.run as jest.Mock).mockResolvedValue(mockData);

      const result = await controller.run(priority);

      expect(result).toEqual(
        plainToInstance(UrlsBySpecificPriorityResponse, { data: mockData }),
      );
      expect(service.run).toHaveBeenCalledWith(priority);
    });
  });
});
