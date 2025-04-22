import {
  Controller,
  Get,
  Query,
  Param,
  Res,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { TouchpointService } from './touchpoints.service';
import { Response } from 'express';
import { TouchpointQueryDto } from './dto/touchpoint-query.dto';
import { Sanitizer } from 'src/overarching-funcs/sanitize-inputs';
import { instanceToPlain } from 'class-transformer';

const controllerName = 'touchpoints';

@ApiTags('RTHA-API')
@Controller(controllerName)
export class TouchpointController {
  constructor(private readonly touchpointService: TouchpointService) { }

  @Get()
  @ApiOperation({
    summary: 'Query SQL-Touchpoints database with filters and pagination',
    description: 'Returns paginated and filtered touchpoint data.',
  })
  async getFilteredTouchpoints(
    @Query() query: TouchpointQueryDto,
    @Res() res: Response,
  ) {
    const sanitizedFilters = Object.fromEntries(
      Object.entries(query).map(([key, value]) => [
        key,
        typeof value === 'string'
          ? Sanitizer.removeNonAlphanumeric(value)
          : value,
      ]),
    );

    const limit = Number(sanitizedFilters.limit ?? 50);
    const offset = Number(sanitizedFilters.offset ?? 0);
    const { limit: _, offset: __, ...filters } = sanitizedFilters;

    try {
      const { data, total } = await this.touchpointService.findWithFilters(
        filters,
        limit,
        offset,
      );

      if (!data || data.length === 0) {
        return res.status(HttpStatus.NOT_FOUND).json({
          status_code: HttpStatus.NOT_FOUND,
          message: `No data found with provided filters.`,
        });
      }

      const nextOffset = offset + limit;
      const hasNextPage = nextOffset < total;

      const queryParams = new URLSearchParams({
        ...Object.entries(query).reduce((acc, [key, value]) => {
          if (value !== undefined && value !== null && value !== '') {
            acc[key] = String(value);
          }
          return acc;
        }, {} as Record<string, string>),
        limit: String(limit),
        offset: String(nextOffset),
      });

      const nextPageUrl = hasNextPage
        ? `http://localhost:3000/${controllerName}?${queryParams.toString()}`
        : null;

      const plainList = data.map((item) => instanceToPlain(item));

      return res.status(HttpStatus.OK).json({
        status: HttpStatus.OK,
        message: 'Success!',
        name: 'RTHA-TOUCHPOINTS-API',
        format: 'JSON',
        total,
        count: plainList.length,
        nextPage: nextPageUrl,
        data: plainList,
      });
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        status_code: HttpStatus.INTERNAL_SERVER_ERROR,
        message: `The server has encountered a problem.`,
      });
    }
  }

  @Get(':FlightID')
  @ApiOperation({
    summary: 'Get single touchpoint by FlightID',
    description: 'Returns a single row from SQL Touchpoints by FlightID',
  })
  async getById(@Param('FlightID') FlightID: string, @Res() res: Response) {
    const numericId = parseInt(FlightID, 10);
    if (isNaN(numericId)) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        status_code: HttpStatus.BAD_REQUEST,
        message: 'Invalid ID provided.',
      });
    }

    const result = await this.touchpointService.findOneById(numericId);
    if (!result) {
      return res.status(HttpStatus.NOT_FOUND).json({
        status_code: HttpStatus.NOT_FOUND,
        message: `Touchpoint with ID ${FlightID} not found.`,
      });
    }

    const plain = instanceToPlain(result);

    return res.status(HttpStatus.OK).json({
      status: HttpStatus.OK,
      message: 'Touchpoint found!',
      data: plain,
    });
  }
}
