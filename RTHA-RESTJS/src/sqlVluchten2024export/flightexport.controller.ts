import {
  Controller,
  Get,
  Query,
  Param,
  Res,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { FlightExportService } from './flightexport.service';
import { Response } from 'express';
import { FlightExportQueryDto } from './dto/flightexport-query.dto';
import { Sanitizer } from 'src/overarching-funcs/sanitize-inputs';
import { instanceToPlain } from 'class-transformer';

const controllerName = 'flightExport';

@ApiTags('RTHA-API')
@Controller(controllerName)
export class FlightExportController {
  constructor(private readonly flightExportService: FlightExportService) { }

  @Get()
  @ApiOperation({
    summary: 'Query SQL-Export database with flexible filters + pagination',
    description: 'Returns filtered data from SQL "Export" database.',
  })
  async getFilteredFlights(
    @Query() query: FlightExportQueryDto,
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
      const { data, total } = await this.flightExportService.findWithFilters(
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
        name: 'RTHA-FLIGHTEXPORT-API',
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
    summary: 'Get a single flight export by FlightID',
    description: 'Returns one record from SQL "Export" database by FlightID.',
  })
  async getById(@Param('FlightID') FlightID: string, @Res() res: Response) {
    const numericId = parseInt(FlightID, 10);
    if (isNaN(numericId)) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        status_code: HttpStatus.BAD_REQUEST,
        message: 'Invalid FlightID provided.',
      });
    }

    const result = await this.flightExportService.findOneById(numericId);
    if (!result) {
      return res.status(HttpStatus.NOT_FOUND).json({
        status_code: HttpStatus.NOT_FOUND,
        message: `Flight export with ID ${FlightID} not found.`,
      });
    }

    const plain = instanceToPlain(result);

    return res.status(HttpStatus.OK).json({
      status: HttpStatus.OK,
      message: 'Flight found!',
      data: plain,
    });
  }
}
