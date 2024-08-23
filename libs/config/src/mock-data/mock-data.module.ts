import { Module } from '@nestjs/common';

import { MockDataService } from './mock-data.service';

@Module({
  imports: [],
  providers: [MockDataService],
  exports: [MockDataService],
})
export class MockDataModule {}
