import { Injectable } from '@nestjs/common';

import { MockDataService } from '@lib/config';

@Injectable()
export class UrlsBySpecificPriorityService {
  constructor(private readonly mockDataService: MockDataService) {}

  async run(priority: number) {
    return this.mockDataService.getUrlsBySpecificPriority(priority);
  }
}
