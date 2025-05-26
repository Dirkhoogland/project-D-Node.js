import {
  Controller,
  Get,
  Query,
  Param,
  Res,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { FlightExportService } from './flightexport.service';
import { Response } from 'express';
import { FlightExportQueryDto } from './dto/flightexport-query.dto';
import { Sanitizer } from 'src/overarching-funcs/sanitize-inputs';
import { instanceToPlain } from 'class-transformer';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth } from '@nestjs/swagger';
import { TouchpointService } from 'src/sqlVluchten2024touchpoints/touchpoints.service';
import { Request } from 'express';
import { Req } from '@nestjs/common'

const controllerName = 'flightExport';

@ApiTags('RTHA-API')
@Controller(controllerName)
export class FlightExportController {
  constructor(
    private readonly flightExportService: FlightExportService,
    private readonly touchpointService: TouchpointService,
    ) { }

  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('jwt')
  @Get('protected')
  @ApiOperation({
    summary: 'Query SQL-Export database with flexible filters + pagination',
    description: 'Returns filtered data from SQL "Export" database.',
  })
  async getFilteredFlights(
    @Query() query: FlightExportQueryDto,
    @Res() res: Response,
    @Req() req: Request,
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

    const isEmpty = Object.keys(filters).length === 0;

    if (isEmpty) {
      const { flightIDs, total } = await this.flightExportService.getAllFlightIDs(limit, offset);

      const urls = flightIDs.map(
        (id) => `http://localhost:3000/${controllerName}?FlightID=${id}`,
      );

      const nextOffset = offset + limit;
      const hasNextPage = nextOffset < total;

      const nextPageUrl = hasNextPage
        ? `http://localhost:3000/${controllerName}?limit=${limit}&offset=${nextOffset}`
        : null;

      return res.status(HttpStatus.OK).json({
        status: HttpStatus.OK,
        message: 'Success! No filters provided, returning FlightID links.',
        name: 'RTHA-FLIGHTEXPORT-API',
        format: 'JSON',
        total,
        count: urls.length,
        nextPage: nextPageUrl,
        data: urls,
      });
    }


    try {
      const { data, total } = await this.flightExportService.findWithFilters(
        filters,
        limit,
        offset,
      );



      // Log the user, what database the query was executed on, the query, the response url, if there are results and the datetime in the Userlogs table.

      // ============== UNCOMMENT ================
      const fullUrl = `${req.protocol}://${req.get('host')}${req.originalUrl}`;
      const queryAsString = JSON.stringify(query);
      const resultFound = data && data.length > 0;
      await this.touchpointService.logUser((req.user as any)?.username, 'Export', queryAsString, fullUrl, resultFound);

      //Checks if what findWithFilters returned is not empty/null, if it is we give return that nothing was found this the provided filters

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

  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('jwt')
  @Get('protected/:FlightID')
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
