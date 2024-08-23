import { Module } from '@nestjs/common';

import { MockDataModule } from '@lib/config';

import { UrlStatusModule } from '../url-status';
import { UrlsBySpecificPriorityController } from './urls-by-specific-priority.controller';
import { UrlsBySpecificPriorityService } from './urls-by-specific-priority.service';

@Module({
  imports: [MockDataModule, UrlStatusModule],
  controllers: [UrlsBySpecificPriorityController],
  providers: [UrlsBySpecificPriorityService],
  exports: [UrlsBySpecificPriorityService],
})
export class UrlsBySpecificPriorityModule {}
