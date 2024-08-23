import { Module } from '@nestjs/common';

import { UrlStatusService } from './url-status.service';

@Module({
  imports: [],
  controllers: [],
  providers: [UrlStatusService],
  exports: [UrlStatusService],
})
export class UrlStatusModule {}
