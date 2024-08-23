import { Injectable } from '@nestjs/common';

import { MockDataService } from '@lib/config';
import { UrlStatusService } from '@lib/use-case/url/url-status';

@Injectable()
export class UrlsBySpecificPriorityService {
  constructor(
    private readonly mockDataService: MockDataService,
    private readonly urlStatusService: UrlStatusService,
  ) {}

  async run(priority: number) {
    // Query urls with priority
    const urlsByPriority =
      await this.mockDataService.getUrlsBySpecificPriority(priority);

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
