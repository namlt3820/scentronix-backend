import { Test, TestingModule } from '@nestjs/testing';
import { plainToInstance } from 'class-transformer';

import { UrlsByPriorityController } from './urls-by-priority.controller';
import { UrlsByPriorityResponse } from './urls-by-priority.response';
import { UrlsByPriorityService } from './urls-by-priority.service';

describe('UrlsByPriorityController', () => {
  let controller: UrlsByPriorityController;
  let mockUrlsByPriorityService: Partial<UrlsByPriorityService>;
  const mockData = [
    { url: 'https://example.com', priority: 1 },
    { url: 'https://example.org', priority: 2 },
  ];

  beforeEach(async () => {
    // Mock the UrlsByPriorityService
    mockUrlsByPriorityService = {
      run: jest.fn().mockResolvedValue(mockData),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UrlsByPriorityController],
      providers: [
        { provide: UrlsByPriorityService, useValue: mockUrlsByPriorityService },
      ],
    }).compile();

    controller = module.get<UrlsByPriorityController>(UrlsByPriorityController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return a list of URLs by priority', async () => {
    const result = await controller.run();
    expect(result).toEqual(
      plainToInstance(UrlsByPriorityResponse, {
        data: mockData,
      }),
    );
    expect(mockUrlsByPriorityService.run).toHaveBeenCalled();
  });
});
