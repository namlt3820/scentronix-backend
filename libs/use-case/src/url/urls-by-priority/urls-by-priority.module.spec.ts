import { CacheModule } from '@nestjs/cache-manager';
import { Test, TestingModule } from '@nestjs/testing';

import { MockDataModule } from '@lib/config/mock-data';
import { UrlStatusModule } from '@lib/use-case/url/url-status';

import { UrlsByPriorityController } from './urls-by-priority.controller';
import { UrlsByPriorityModule } from './urls-by-priority.module';
import { UrlsByPriorityService } from './urls-by-priority.service';

describe.only('UrlsByPriorityModule', () => {
  let module: TestingModule;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [CacheModule.register({ isGlobal: true }), UrlsByPriorityModule],
      providers: [],
    }).compile();
  });

  it('should be defined', () => {
    expect(module).toBeDefined();
  });

  it('should have UrlsByPriorityController registered', () => {
    const controller = module.get<UrlsByPriorityController>(
      UrlsByPriorityController,
    );
    expect(controller).toBeDefined();
  });

  it('should have UrlsByPriorityService registered', () => {
    const service = module.get<UrlsByPriorityService>(UrlsByPriorityService);
    expect(service).toBeDefined();
  });

  it('should import MockDataModule and UrlStatusModule', () => {
    const mockDataModule = module.get(MockDataModule);
    const urlStatusModule = module.get(UrlStatusModule);

    expect(mockDataModule).toBeDefined();
    expect(urlStatusModule).toBeDefined();
  });
});
