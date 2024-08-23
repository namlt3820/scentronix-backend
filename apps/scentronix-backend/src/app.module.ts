import { Module } from '@nestjs/common';

import { UrlModule } from '@lib/use-case/url/url.module';

@Module({
  imports: [
    // config modules

    // use-case modules
    UrlModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
