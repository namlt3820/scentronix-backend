import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Test, TestingModule } from '@nestjs/testing';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

import { UrlStatusService } from './url-status.service';

// Update with your actual service path

describe('UrlStatusService', () => {
  let service: UrlStatusService;
  let mockAxios: MockAdapter;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UrlStatusService,
        {
          provide: CACHE_MANAGER,
          useValue: {
            get: jest.fn(),
            set: jest.fn(),
          },
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
});
