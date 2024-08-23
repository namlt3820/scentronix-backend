import { Injectable } from '@nestjs/common';

import { MockDataService } from '@lib/config';
import { UrlStatusService } from '@lib/use-case/url/url-status';

@Injectable()
export class UrlsByPriorityService {
  constructor(
    private readonly mockDataService: MockDataService,
    private readonly urlStatusService: UrlStatusService,
  ) {}

  async run() {
    // Query urls with priority
    const urlsByPriority = await this.mockDataService.getUrlsByPriority();

    // Extract to array of string
    const urls = urlsByPriority.map(({ url }) => url);

    // Check status
    const urlStatuses = await this.urlStatusService.checkMultipleUrls(urls);

    // Filter available urls
    const urlsAvaiable = urlsByPriority.filter(({ url }) =>
      urlStatuses.some((status) => status.url === url && status.isAvailable),
    );

    return urlsAvaiable;
  }
}
