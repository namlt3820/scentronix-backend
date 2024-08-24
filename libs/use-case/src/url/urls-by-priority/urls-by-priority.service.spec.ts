import { Test, TestingModule } from '@nestjs/testing';

import { MockDataService } from '@lib/config';
import { UrlDto } from '@lib/config';
import { UrlStatusService } from '@lib/use-case/url/url-status';

import { UrlsByPriorityService } from './urls-by-priority.service';

describe('UrlsByPriorityService', () => {
  let service: UrlsByPriorityService;
  let mockDataService: MockDataService;
  let urlStatusService: UrlStatusService;

  beforeEach(async () => {
    mockDataService = { getUrlsByPriority: jest.fn() } as any;
    urlStatusService = { checkMultipleUrls: jest.fn() } as any;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UrlsByPriorityService,
        { provide: MockDataService, useValue: mockDataService },
        { provide: UrlStatusService, useValue: urlStatusService },
      ],
    }).compile();

    service = module.get<UrlsByPriorityService>(UrlsByPriorityService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('run', () => {
    it('should return available URLs based on status', async () => {
      const mockUrls: UrlDto[] = [
        { url: 'https://gitlab.com', priority: 4 },
        { url: 'https://github.com', priority: 4 },
        { url: 'https://doesnt-work.github.com', priority: 4 },
        { url: 'http://app.scnt.me', priority: 3 },
      ];

      const mockStatuses = [
        { url: 'https://gitlab.com', isAvailable: true },
        { url: 'https://github.com', isAvailable: true },
        { url: 'https://doesnt-work.github.com', isAvailable: false },
        { url: 'http://app.scnt.me', isAvailable: true },
      ];

      (mockDataService.getUrlsByPriority as jest.Mock).mockResolvedValue(
        mockUrls,
      );
      (urlStatusService.checkMultipleUrls as jest.Mock).mockResolvedValue(
        mockStatuses,
      );

      const result = await service.run();

      expect(result).toEqual([
        { url: 'https://gitlab.com', priority: 4 },
        { url: 'https://github.com', priority: 4 },
        { url: 'http://app.scnt.me', priority: 3 },
      ]);
    });
  });
});
