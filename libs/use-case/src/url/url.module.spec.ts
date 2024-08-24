import { CacheModule } from '@nestjs/cache-manager';
import { Test, TestingModule } from '@nestjs/testing';

import { UrlModule } from './url.module';
import { UrlsByPriorityModule } from './urls-by-priority';
import { UrlsBySpecificPriorityModule } from './urls-by-specific-priority';

describe('UrlModule', () => {
  let module: TestingModule;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [CacheModule.register({ isGlobal: true }), UrlModule],
      providers: [],
    }).compile();
  });

  it('should be defined', () => {
    expect(module).toBeDefined();
  });

  it('should import UrlsBySpecificPriorityModule and UrlsByPriorityModule', () => {
    const urlsBySpecificPriorityModule = module.get(
      UrlsBySpecificPriorityModule,
    );
    const urlsByPriorityModule = module.get(UrlsByPriorityModule);

    expect(urlsBySpecificPriorityModule).toBeDefined();
    expect(urlsByPriorityModule).toBeDefined();
  });
});
