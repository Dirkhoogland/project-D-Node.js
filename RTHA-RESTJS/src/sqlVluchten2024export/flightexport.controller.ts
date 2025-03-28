import { Controller, Get, Query, Res, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { FlightExportService } from './flightexport.service';
import { Response } from 'express';
import { FlightExportQueryDto } from './dto/flightexport-query.dto'; // Zorg dat je dit bestand straks hebt
import { Sanitizer } from 'src/overarching-funcs/sanitize-inputs';

const controllerName = 'flightExport';

@ApiTags('RTHA-API')
@Controller(controllerName)
export class FlightExportController {
  constructor(private readonly flightExportService: FlightExportService) { }

  @Get()
  @ApiOperation({
    summary: 'Query SQL-Export database with flexible filters',
    description: 'Returns filtered data from SQL "Export" database.',
  })
  async getFilteredFlights(
    @Query() query: FlightExportQueryDto,
    @Res() res: Response,
  ) {
    const sanitizedFilters = Object.fromEntries(
      Object.entries(query).map(([key, value]) => [
        key,
        typeof value === 'string' ? Sanitizer.removeNonAlphanumeric(value) : value,
      ]),
    );

    try {
      const result = await this.flightExportService.findWithFilters(sanitizedFilters);

      if (!result || result.length === 0) {
        return res.status(HttpStatus.NOT_FOUND).json({
          status_code: HttpStatus.NOT_FOUND,
          message: `No data found with provided filters.`,
        });
      }

      return res.status(HttpStatus.OK).json({
        status: HttpStatus.OK,
        message: 'Success!',
        name: 'RTHA-FLIGHTEXPORT-API',
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
