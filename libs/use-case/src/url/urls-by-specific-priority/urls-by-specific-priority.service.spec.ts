import { Test, TestingModule } from '@nestjs/testing';

import { MockDataService } from '@lib/config';
import { UrlDto } from '@lib/config';
import { UrlStatusService } from '@lib/use-case/url/url-status';

import { UrlsBySpecificPriorityService } from './urls-by-specific-priority.service';

describe('UrlsBySpecificPriorityService', () => {
  let service: UrlsBySpecificPriorityService;
  let mockDataService: MockDataService;
  let urlStatusService: UrlStatusService;

  beforeEach(async () => {
    mockDataService = { getUrlsBySpecificPriority: jest.fn() } as any;
    urlStatusService = { checkMultipleUrls: jest.fn() } as any;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UrlsBySpecificPriorityService,
        { provide: MockDataService, useValue: mockDataService },
        { provide: UrlStatusService, useValue: urlStatusService },
      ],
    }).compile();

    service = module.get<UrlsBySpecificPriorityService>(
      UrlsBySpecificPriorityService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('run', () => {
    it('should return available URLs based on specific priority', async () => {
      const priority = 4;
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

      (
        mockDataService.getUrlsBySpecificPriority as jest.Mock
      ).mockResolvedValue(mockUrls.filter((url) => url.priority === priority));

      (urlStatusService.checkMultipleUrls as jest.Mock).mockResolvedValue(
        mockStatuses,
      );

      const result = await service.run(priority);

      expect(result).toEqual([
        { url: 'https://gitlab.com', priority: 4 },
        { url: 'https://github.com', priority: 4 },
      ]);
    });
  });
});
