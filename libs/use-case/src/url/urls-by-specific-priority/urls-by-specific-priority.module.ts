import { Module } from '@nestjs/common';

import { MockDataModule } from '@lib/config';

import { UrlsBySpecificPriorityController } from './urls-by-specific-priority.controller';
import { UrlsBySpecificPriorityService } from './urls-by-specific-priority.service';

@Module({
  imports: [MockDataModule],
  controllers: [UrlsBySpecificPriorityController],
  providers: [UrlsBySpecificPriorityService],
  exports: [UrlsBySpecificPriorityService],
})
export class UrlsBySpecificPriorityModule {}
