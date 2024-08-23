import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';
import { Inject, Injectable, Logger } from '@nestjs/common';
import axios, { AxiosResponse } from 'axios';

interface UrlStatus {
  url: string;
  isAvailable: boolean;
}

@Injectable()
export class UrlStatusService {
  private readonly logger = new Logger(UrlStatusService.name);

  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  async checkOneUrl(url: string): Promise<UrlStatus> {
    const result: UrlStatus = { url, isAvailable: false };

    this.logger.log(`Checking cache for URL: ${url}`);
    const urlStatusInCache = await this.getUrlStatusInCache(url);

    if (urlStatusInCache !== undefined) {
      result.isAvailable = urlStatusInCache;
      this.logger.log(`Cache hit for URL: ${url}, Status: ${urlStatusInCache}`);
      return result;
    }

    this.logger.log(`URL not found in cache. Checking URL directly: ${url}`);
    const isUrlAvailable = await this.checkUrlDirectly(url);

    await this.setUrlStatusInCache(url, isUrlAvailable);
    result.isAvailable = isUrlAvailable;

    this.logger.log(`URL status for ${url} is ${isUrlAvailable}`);
    return result;
  }

  async checkMultipleUrls(urls: string[]): Promise<UrlStatus[]> {
    return Promise.all(
      urls.map(async (url) => {
        return await this.checkOneUrl(url);
      }),
    );
  }

  private async setUrlStatusInCache(
    url: string,
    isAvailable: boolean,
  ): Promise<void> {
    const encodedUrl = this.encodeUrlToBase64(url);
    await this.cacheManager.set(encodedUrl, isAvailable, 5 * 60 * 1000); // TTL: 5 minutes
  }

  private async getUrlStatusInCache(url: string): Promise<boolean | null> {
    const encodedUrl = this.encodeUrlToBase64(url);
    const status = await this.cacheManager.get<boolean>(encodedUrl);
    return status;
  }

  private isInAvailableRange(status: number): boolean {
    return status >= 200 && status <= 299;
  }

  private encodeUrlToBase64(url: string): string {
    return Buffer.from(url).toString('base64');
  }

  private async checkUrlDirectly(url: string): Promise<boolean> {
    try {
      const response: AxiosResponse = await axios.get(url, { timeout: 5000 });
      const isAvailable = this.isInAvailableRange(response.status);

      return isAvailable;
    } catch (error) {
      this.logger.error(
        `Error checking URL directly: ${url}, Error: ${error.message}`,
      );
      return false;
    }
  }
}
