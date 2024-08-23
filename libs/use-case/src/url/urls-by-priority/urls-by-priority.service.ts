import { Injectable } from '@nestjs/common';

import { MockDataService } from '@lib/config';

@Injectable()
export class UrlsByPriorityService {
  constructor(private readonly mockDataService: MockDataService) {}

  async run() {
    return this.mockDataService.getUrlsByPriority();
  }
}
