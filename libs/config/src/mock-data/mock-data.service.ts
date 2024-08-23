import { Injectable } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';

export class UrlDto {
  @ApiProperty()
  url: string;

  @ApiProperty()
  priority: number;
}

@Injectable()
export class MockDataService {
  private readonly urls: UrlDto[] = [
    { url: 'https://does-not-work.perfume.new', priority: 1 },
    { url: 'https://gitlab.com', priority: 4 },
    { url: 'https://github.com', priority: 4 },
    { url: 'https://doesnt-work.github.com', priority: 4 },
    { url: 'http://app.scnt.me', priority: 3 },
    { url: 'https://offline.scentronix.com', priority: 2 },
  ];

  // Method to get all URLs ordered by priority
  async getUrlsByPriority(): Promise<UrlDto[]> {
    return this.urls.sort((a, b) => a.priority - b.priority);
  }

  // Method to get URLs by a specific priority
  async getUrlsBySpecificPriority(priority: number): Promise<UrlDto[]> {
    return this.urls.filter((url) => url.priority === priority);
  }
}
