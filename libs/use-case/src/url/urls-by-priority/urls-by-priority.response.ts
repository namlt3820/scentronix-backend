import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

import { UrlDto } from '@lib/config';

export class UrlsByPriorityResponse {
  @ApiProperty()
  @Type(() => UrlDto)
  data: UrlDto[];
}
