import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Test, TestingModule } from '@nestjs/testing';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

import { UrlStatus, UrlStatusService } from './url-status.service';

// Update with your actual service path

describe('UrlStatusService', () => {
  let service: UrlStatusService;
  let mockAxios: MockAdapter;
  let mockCacheManager: { get: jest.Mock; set: jest.Mock };

  beforeEach(async () => {
    mockCacheManager = {
      get: jest.fn(),
      set: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UrlStatusService,
        {
          provide: CACHE_MANAGER,
          useValue: mockCacheManager,
        },
      ],
    }).compile();

    service = module.get<UrlStatusService>(UrlStatusService);

    // Create a mock adapter for axios
    mockAxios = new MockAdapter(axios);

    // Call the reusable mock setup
    mockUrlResponses();
  });

  afterEach(() => {
    // Reset mock after each test to ensure a clean state
    mockAxios.reset();
  });

  afterAll(() => {
    // Clean up mock after all tests are done
    mockAxios.restore();
  });

  // Define reusable mock configurations
  const mockUrlResponses = () => {
    mockAxios.onGet('https://does-not-work.perfume.new').timeout();
    mockAxios.onGet('https://gitlab.com').reply(200);
    mockAxios.onGet('https://github.com').reply(200);
    mockAxios.onGet('https://doesnt-work.github.com').reply(404);
    mockAxios.onGet('https://offline.scentronix.com').networkError();
    mockAxios
      .onGet('http://app.scnt.me')
      .replyOnce(200)
      .onGet('http://app.scnt.me')
      .timeout();
  };

  describe('checkUrlDirectly', () => {
    it('should return false for timeout error', async () => {
      const result = await service['checkUrlDirectly'](
        'https://does-not-work.perfume.new',
      );
      expect(result).toBe(false);
    });

    it('should return true for valid response', async () => {
      const result = await service['checkUrlDirectly']('https://gitlab.com');
      expect(result).toBe(true);
    });

    it('should return false for 404 error', async () => {
      const result = await service['checkUrlDirectly'](
        'https://doesnt-work.github.com',
      );
      expect(result).toBe(false);
    });

    it('should return false for SSL certificate error', async () => {
      const result = await service['checkUrlDirectly'](
        'https://offline.scentronix.com',
      );
      expect(result).toBe(false);
    });

    it('should handle intermittent availability', async () => {
      const firstResult =
        await service['checkUrlDirectly']('http://app.scnt.me');
      const secondResult =
        await service['checkUrlDirectly']('http://app.scnt.me');

      expect(firstResult).toBe(true);
      expect(secondResult).toBe(false);
    });
  });

  describe('encodeUrlToBase64', () => {
    it('should correctly encode a URL to Base64', () => {
      const url = 'https://github.com';
      const expectedBase64 = 'aHR0cHM6Ly9naXRodWIuY29t';

      expect(service['encodeUrlToBase64'](url)).toBe(expectedBase64);
    });
  });

  describe('isInAvailableRange', () => {
    it('should return true for status code 200', () => {
      expect(service['isInAvailableRange'](200)).toBe(true);
    });

    it('should return true for status code 299', () => {
      expect(service['isInAvailableRange'](299)).toBe(true);
    });

    it('should return false for status code 199', () => {
      expect(service['isInAvailableRange'](199)).toBe(false);
    });

    it('should return false for status code 300', () => {
      expect(service['isInAvailableRange'](300)).toBe(false);
    });

    it('should return false for status code 404', () => {
      expect(service['isInAvailableRange'](404)).toBe(false);
    });
  });

  describe('setUrlStatusInCache', () => {
    it('should encode URL and set it in cache with TTL', async () => {
      const url = 'http://example.com';
      const isAvailable = true;
      const encodedUrl = service['encodeUrlToBase64'](url);

      await service['setUrlStatusInCache'](url, isAvailable);

      expect(mockCacheManager.set).toHaveBeenCalledWith(
        encodedUrl,
        isAvailable,
        5 * 60 * 1000,
      );
      expect(mockCacheManager.set).toHaveBeenCalledTimes(1);
    });
  });

  describe('getUrlStatusInCache', () => {
    it('should encode URL and get status from cache', async () => {
      const url = 'http://example.com';
      const encodedUrl = service['encodeUrlToBase64'](url);
      const cachedStatus = true;

      mockCacheManager.get.mockResolvedValue(cachedStatus);

      const result = await service['getUrlStatusInCache'](url);

      expect(mockCacheManager.get).toHaveBeenCalledWith(encodedUrl);
      expect(result).toBe(cachedStatus);
    });
  });

  describe('checkOneUrl', () => {
    it('should return status from cache if available', async () => {
      const url = 'http://example.com';
      const cachedStatus = true;
      const encodedUrl = service['encodeUrlToBase64'](url);
      mockCacheManager.get.mockResolvedValue(cachedStatus);
      const result = await service.checkOneUrl(url);

      expect(result).toEqual({ url, isAvailable: cachedStatus });
      expect(mockCacheManager.get).toHaveBeenCalledWith(encodedUrl);
    });

    it('should check URL directly and update cache if not in cache', async () => {
      const url = 'http://example.com';
      const isUrlAvailable = true;
      const encodedUrl = service['encodeUrlToBase64'](url);
      mockCacheManager.get.mockResolvedValue(undefined);
      jest
        .spyOn(service as any, 'checkUrlDirectly')
        .mockResolvedValue(isUrlAvailable);

      const result = await service.checkOneUrl(url);

      expect(result).toEqual({ url, isAvailable: isUrlAvailable });
      expect(mockCacheManager.get).toHaveBeenCalledWith(encodedUrl);
      expect(service['checkUrlDirectly']).toHaveBeenCalledWith(url);
      expect(mockCacheManager.set).toHaveBeenCalledWith(
        encodedUrl,
        isUrlAvailable,
        5 * 60 * 1000,
      );
    });
  });

  describe('checkMultipleUrls', () => {
    it('should return an array of UrlStatus objects for multiple URLs', async () => {
      const urls = ['http://example1.com', 'http://example2.com'];
      const statusResults: UrlStatus[] = [
        { url: 'http://example1.com', isAvailable: true },
        { url: 'http://example2.com', isAvailable: false },
      ];

      // Mock checkOneUrl to return predefined results
      jest
        .spyOn(service, 'checkOneUrl')
        .mockImplementation(async (url: string) => {
          return statusResults.find((status) => status.url === url);
        });

      const result = await service.checkMultipleUrls(urls);

      expect(result).toEqual(statusResults);
      expect(service.checkOneUrl).toHaveBeenCalledTimes(urls.length);
      urls.forEach((url) => {
        expect(service.checkOneUrl).toHaveBeenCalledWith(url);
      });
    });
  });
});
