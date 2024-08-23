import { Controller, Get } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { plainToInstance } from 'class-transformer';

import { UrlsByPriorityResponse } from './urls-by-priority.response';
import { UrlsByPriorityService } from './urls-by-priority.service';

@ApiTags('Urls')
@Controller('urls')
export class UrlsByPriorityController {
  constructor(private readonly urlsByPriorityService: UrlsByPriorityService) {}

  @Get()
  @ApiResponse({
    status: 201,
    type: UrlsByPriorityResponse,
  })
  async run(): Promise<UrlsByPriorityResponse> {
    const data = await this.urlsByPriorityService.run();

    return plainToInstance(UrlsByPriorityResponse, { data });
  }
}
