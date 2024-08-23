import { Module } from '@nestjs/common';

import { UrlsByPriorityModule } from './urls-by-priority';
import { UrlsBySpecificPriorityModule } from './urls-by-specific-priority';

@Module({
  imports: [UrlsByPriorityModule, UrlsBySpecificPriorityModule],
  providers: [],
  exports: [],
})
export class UrlModule {}
