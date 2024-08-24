import { CacheModule } from '@nestjs/cache-manager';
import { Test, TestingModule } from '@nestjs/testing';

import { MockDataModule } from '@lib/config/mock-data';
import { UrlStatusModule } from '@lib/use-case/url/url-status';

import { UrlsBySpecificPriorityController } from './urls-by-specific-priority.controller';
import { UrlsBySpecificPriorityModule } from './urls-by-specific-priority.module';
import { UrlsBySpecificPriorityService } from './urls-by-specific-priority.service';

describe.only('UrlsBySpecificPriorityModule', () => {
  let module: TestingModule;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [
        CacheModule.register({ isGlobal: true }),
        UrlsBySpecificPriorityModule,
      ],
      providers: [],
    }).compile();
  });

  it('should be defined', () => {
    expect(module).toBeDefined();
  });

  it('should have UrlsBySpecificPriorityController registered', () => {
    const controller = module.get<UrlsBySpecificPriorityController>(
      UrlsBySpecificPriorityController,
    );
    expect(controller).toBeDefined();
  });

  it('should have UrlsBySpecificPriorityService registered', () => {
    const service = module.get<UrlsBySpecificPriorityService>(
      UrlsBySpecificPriorityService,
    );
    expect(service).toBeDefined();
  });

  it('should import MockDataModule and UrlStatusModule', () => {
    const mockDataModule = module.get(MockDataModule);
    const urlStatusModule = module.get(UrlStatusModule);

    expect(mockDataModule).toBeDefined();
    expect(urlStatusModule).toBeDefined();
  });
});
