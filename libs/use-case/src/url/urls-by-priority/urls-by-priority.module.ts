import { Module } from '@nestjs/common';

import { MockDataModule } from '@lib/config';

import { UrlStatusModule } from '../url-status';
import { UrlsByPriorityController } from './urls-by-priority.controller';
import { UrlsByPriorityService } from './urls-by-priority.service';

@Module({
  imports: [MockDataModule, UrlStatusModule],
  controllers: [UrlsByPriorityController],
  providers: [UrlsByPriorityService],
  exports: [UrlsByPriorityService],
})
export class UrlsByPriorityModule {}
