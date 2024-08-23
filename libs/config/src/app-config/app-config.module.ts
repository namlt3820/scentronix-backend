import { Module } from '@nestjs/common';
import { ConfigModule, ConfigModuleOptions } from '@nestjs/config';
import * as Joi from 'joi';

import { RedisConfig } from './configs';

const configModuleOptions: ConfigModuleOptions = {
  isGlobal: true,
  /**
   * remove configs to load if the project doesnt need them
   */
  load: [RedisConfig],

  validationSchema: Joi.object({
    /**
     * redis
     */
    REDIS_HOST: Joi.string().required(),
    REDIS_PORT: Joi.string().required(),
    REDIS_PASSWORD: Joi.string().required(),
  }),
};

@Module({
  imports: [ConfigModule.forRoot(configModuleOptions)],
})
export class AppConfigModule {}
