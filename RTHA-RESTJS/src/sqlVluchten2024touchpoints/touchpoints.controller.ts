import { Controller, Get, Query, Res, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { TouchpointService } from './touchpoints.service';
import { Response } from 'express';
import { TouchpointQueryDto } from './dto/touchpoint-query.dto'; // <-- pad aanpassen als nodig
import { Sanitizer } from 'src/overarching-funcs/sanitize-inputs';

const controllerName = 'touchpoints';

@ApiTags('RTHA-API')
@Controller(controllerName)
export class TouchpointController {
  constructor(private readonly touchpointService: TouchpointService) { }

  @Get()
  @ApiOperation({
    summary: 'Query SQL-Touchpoints database with flexible filters',
    description: 'Returns filtered data from SQL "Touchpoints" database.',
  })
  async getFilteredTouchpoints(
    @Query() query: TouchpointQueryDto,
    @Res() res: Response,
  ) {
    const sanitizedFilters = Object.fromEntries(
      Object.entries(query).map(([key, value]) => [
        key,
        typeof value === 'string' ? Sanitizer.removeNonAlphanumeric(value) : value,
      ]),
    );

    try {
      const result = await this.touchpointService.findWithFilters(sanitizedFilters);

      if (!result || result.length === 0) {
        return res.status(HttpStatus.NOT_FOUND).json({
          status_code: HttpStatus.NOT_FOUND,
          message: `No data found with provided filters.`,
        });
      }

      return res.status(HttpStatus.OK).json({
        status: HttpStatus.OK,
        message: 'Success!',
        name: 'RTHA-TOUCHPOINTS-API',
        format: 'JSON',
        query,
        url: `http://localhost:3000/${controllerName}?...`,
        data: result,
      });
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        status_code: HttpStatus.INTERNAL_SERVER_ERROR,
        message: `The server has encountered a problem.`,
      });
    }
  }
}
