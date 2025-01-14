import { Module } from '@nestjs/common';

import { AppCacheModule, AppConfigModule } from '@lib/config';
import { UrlModule } from '@lib/use-case/url';

@Module({
  imports: [
    // config modules
    AppConfigModule,
    AppCacheModule,

    // use-case modules
    UrlModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
