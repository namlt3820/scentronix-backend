import { Module } from '@nestjs/common';

import { MockDataModule } from '@lib/config';

import { UrlsByPriorityController } from './urls-by-priority.controller';
import { UrlsByPriorityService } from './urls-by-priority.service';

@Module({
  imports: [MockDataModule],
  controllers: [UrlsByPriorityController],
  providers: [UrlsByPriorityService],
  exports: [UrlsByPriorityService],
})
export class UrlsByPriorityModule {}
