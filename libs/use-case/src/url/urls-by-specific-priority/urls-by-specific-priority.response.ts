import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

import { UrlDto } from '@lib/config';

export class UrlsBySpecificPriorityResponse {
  @ApiProperty()
  @Type(() => UrlDto)
  data: UrlDto[];
}
