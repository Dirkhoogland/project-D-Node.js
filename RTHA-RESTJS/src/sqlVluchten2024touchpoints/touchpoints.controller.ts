import {
  Controller,
  Get,
  Query,
  Param,
  Res,
  HttpStatus,
  UseGuards,
  NotFoundException,
  Request,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { Response } from 'express';
import { instanceToPlain } from 'class-transformer';
import { AuthGuard } from '@nestjs/passport';
import { TouchpointService } from './touchpoints.service';
import { TouchpointQueryDto } from './dto/touchpoint-query.dto';
import { Sanitizer } from 'src/overarching-funcs/sanitize-inputs';
import { JsonWebTokenError } from '@nestjs/jwt';
import { LoggingService } from 'src/logging/logging.service';

const controllerName = 'touchpoints';

@ApiTags('RTHA-API')
@Controller(controllerName)
export class TouchpointController {
  constructor(private readonly touchpointService: TouchpointService,
    private readonly loggingService: LoggingService,
  ) { }

  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('jwt')

  @Get()
  @ApiOperation({
    summary: 'Query SQL-Touchpoints database with filters and pagination',
    description: 'Returns paginated and filtered touchpoint data.',
  })
  async getFilteredTouchpoints(
    @Query() query: TouchpointQueryDto,
    @Request() req,
    @Res() res: Response,
  ) {
    const user = req.user;
    console.log('Authenticated user:', user.username);

    const sanitizedFilters = Object.fromEntries(
      Object.entries(query).map(([key, value]) => [
        key,
        typeof value === 'string'
          ? Sanitizer.removeNonAlphanumeric(value)
          : value,
      ]),
    );

    const { limit: rawLimit, offset: rawOffset, ...rawFilters } = sanitizedFilters;

    const limit = Number.isNaN(Number(rawLimit)) ? 50 : Number(rawLimit);
    const offset = Number.isNaN(Number(rawOffset)) ? 0 : Number(rawOffset);

    const filters = Object.fromEntries(
      Object.entries(rawFilters).filter(
        ([_, value]) => value !== undefined && value !== null && value !== '',
      ),
    );

    const isEmpty = Object.keys(filters).length === 0;

    if (isEmpty) {
      const { flightIDs, total } = await this.touchpointService.getAllFlightIDs(limit, offset);

      const enriched = await Promise.all(
        flightIDs.map(async (id) => {
          const tp = await this.touchpointService.findOneById(id);
          const scheduled = tp?.ScheduledLocal?.toISOString?.() || '';

          return [
            id,
            scheduled,
            `${req.protocol}://${req.get('host')}/${controllerName}?FlightID=${id}&ScheduledLocal=${encodeURIComponent(scheduled)}`,
          ];
        }),
      );


      const nextOffset = offset + limit;
      const hasNextPage = nextOffset < total;

      const nextPageUrl = hasNextPage
        ? `${req.get('host')}/${controllerName}?limit=${limit}&offset=${nextOffset}`
        : null;

      const fullUrl = `${req.protocol}://${req.get('host')}${req.originalUrl}`;
      const queryAsString = JSON.stringify(query);
      // Gets the client ip (?)
      const clientIP = typeof req.headers['x-forwarded-for'] === 'string'
        ? req.headers['x-forwarded-for'].split(',')[0].trim()
        : req.socket.remoteAddress || '';

      await this.loggingService.logUser((req.user as any)?.username, 'Touchpoints', queryAsString, fullUrl, true, 'GET', clientIP, undefined, HttpStatus.OK);

      return res.status(HttpStatus.OK).json({
        status: HttpStatus.OK,
        message: 'Success! No filters provided, returning FlightID + ScheduledLocal + URL.',
        name: 'RTHA-TOUCHPOINTS-API',
        format: 'JSON',
        total,
        count: enriched.length,
        nextPage: nextPageUrl,
        data: enriched,
      });
    }

    const fullUrl = `${req.protocol}://${req.get('host')}${req.originalUrl}`;
    const queryAsString = JSON.stringify(query);
    // Gets the client ip (?)
    const clientIP = typeof req.headers['x-forwarded-for'] === 'string'
      ? req.headers['x-forwarded-for'].split(',')[0].trim()
      : req.socket.remoteAddress || '';

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
            acc[key] = value instanceof Date ? value.toISOString() : String(value);
          }
          return acc;
        }, {} as Record<string, string>),
        limit: String(limit),
        offset: String(nextOffset),
      });

      const nextPageUrl = hasNextPage
        ? `${req.get('host')}/${controllerName}/protected?${queryParams.toString()}`
        : null;

      const plainList = data.map((item) => instanceToPlain(item));

      const resultFound = data && data.length > 0;
      const responseCode = HttpStatus.OK;

      await this.loggingService.logUser((req.user as any)?.username, 'Export', queryAsString, fullUrl, resultFound, 'GET', clientIP, undefined, responseCode);

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
      await this.loggingService.logUser((req.user as any)?.username, 'Export', queryAsString, fullUrl, false, 'GET', clientIP, error.message, HttpStatus.INTERNAL_SERVER_ERROR);
      if (error instanceof JsonWebTokenError) {
        throw new Error(error.message)
      }
      else {
        throw new Error('The server has encountered a problem: ' + error.message);
      }
    }
  }

  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('jwt')
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
