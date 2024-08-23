import { Test, TestingModule } from '@nestjs/testing';

import { MockDataService } from './mock-data.service';

describe('MockDataService', () => {
  let service: MockDataService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MockDataService],
    }).compile();

    service = module.get<MockDataService>(MockDataService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should get urls by priority', async () => {
    const urls = await service.getUrlsByPriority();
    expect(urls).toBeDefined();
    expect(urls).toHaveLength(6);
    expect(urls[0].priority).toBe(1);
    expect(urls[5].priority).toBe(4);
  });

  it('should get urls by specific priority', async () => {
    const priority = 4;
    const urls = await service.getUrlsBySpecificPriority(priority);
    expect(urls).toBeDefined();
    expect(urls.every((url) => url.priority === priority)).toBe(true);
    expect(urls).toHaveLength(3);
  });

  it('should return an empty array for non-existent priority', async () => {
    const priority = 100;
    const urls = await service.getUrlsBySpecificPriority(priority);
    expect(urls).toBeDefined();
    expect(urls).toHaveLength(0);
  });
});
