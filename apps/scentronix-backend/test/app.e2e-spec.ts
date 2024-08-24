import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import * as request from 'supertest';

import { AppModule } from './../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let mockAxios: MockAdapter;

  let moduleFixture: TestingModule;

  beforeEach(async () => {
    // Create a mock adapter for axios
    mockAxios = new MockAdapter(axios);

    // Call the reusable mock setup
    mockUrlResponses();

    moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
      providers: [],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterEach(async () => {
    // Reset mock after each test to ensure a clean state
    mockAxios.reset();
  });

  afterAll(async () => {
    // Clean up mock after all tests are done
    mockAxios.restore();
  });

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

  it('/urls (GET)', () => {
    return request(app.getHttpServer())
      .get('/urls')
      .expect(200)
      .expect({
        data: [
          { url: 'http://app.scnt.me', priority: 3 },
          { url: 'https://gitlab.com', priority: 4 },
          { url: 'https://github.com', priority: 4 },
        ],
      });
  });

  it('/urls/::priority (GET)', () => {
    return request(app.getHttpServer())
      .get('/urls/4')
      .expect(200)
      .expect({
        data: [
          { url: 'https://gitlab.com', priority: 4 },
          { url: 'https://github.com', priority: 4 },
        ],
      });
  });
});
