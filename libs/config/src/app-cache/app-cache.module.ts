import { CacheModule, CacheModuleAsyncOptions } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { redisStore } from 'cache-manager-redis-yet';
import { RedisClientOptions } from 'redis';

const cacheModuleAsyncOptions: CacheModuleAsyncOptions = {
  inject: [ConfigService],
  useFactory: async (configService: ConfigService) => {
    return {
      store: redisStore,
      socket: {
        host: configService.get<string>('redis.host'),
        port: configService.get<number>('redis.port'),
      },
      password: configService.get<string>('redis.password'),
    };
  },
  isGlobal: true,
};

@Module({
  imports: [
    CacheModule.registerAsync<RedisClientOptions>(cacheModuleAsyncOptions),
  ],
  providers: [],
  exports: [],
})
export class AppCacheModule {}
