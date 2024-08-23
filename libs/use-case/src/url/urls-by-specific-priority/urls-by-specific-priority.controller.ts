import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { plainToInstance } from 'class-transformer';

import { UrlsBySpecificPriorityResponse } from './urls-by-specific-priority.response';
import { UrlsBySpecificPriorityService } from './urls-by-specific-priority.service';

@ApiTags('Urls')
@Controller('urls')
export class UrlsBySpecificPriorityController {
  constructor(
    private readonly urlsBySpecificPriorityService: UrlsBySpecificPriorityService,
  ) {}

  @Get(':priority')
  @ApiResponse({
    status: 201,
    type: UrlsBySpecificPriorityService,
  })
  async run(
    @Param('priority', ParseIntPipe) priority: number,
  ): Promise<UrlsBySpecificPriorityResponse> {
    const data = await this.urlsBySpecificPriorityService.run(priority);

    return plainToInstance(UrlsBySpecificPriorityResponse, { data });
  }
}
