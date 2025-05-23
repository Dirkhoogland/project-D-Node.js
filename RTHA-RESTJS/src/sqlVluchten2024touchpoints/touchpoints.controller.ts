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

const controllerName = 'touchpoints';

@ApiTags('RTHA-API')
@Controller(controllerName)
export class TouchpointController {
  constructor(private readonly touchpointService: TouchpointService) { }

  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('jwt')

  @Get('protected')
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


    //Cleaning up the query by removing any unwanted characters with Sanitizer
    const sanitizedFilters = Object.fromEntries(
      Object.entries(query).map(([key, value]) => [
        key,
        typeof value === 'string'
          ? Sanitizer.removeNonAlphanumeric(value)
          : value,
      ]),
    );


    //Checks if the sanitizedFiters contain limits and offsets, if adds default limit (50) and default offset (0)
    const limit = Number(sanitizedFilters.limit ?? 50);
    const offset = Number(sanitizedFilters.offset ?? 0);

    //Seperates the limit and offset from the other filters, this is so we can start using the services to search through the database
    const { limit: _, offset: __, ...filters } = sanitizedFilters;



    //Tries to use FindWithFilters (this is a method from touchpoints.service.ts) and gives it the filters (the query), limit and offset
    try {
      const { data, total } = await this.touchpointService.findWithFilters(
        filters,
        limit,
        offset,
      );

      // Log the user, what database the query was executed on, the query, the response url, if there are results and the datetime in the Userlogs table.
      const fullUrl = `${req.protocol}://${req.get('host')}${req.originalUrl}`;
      const queryAsString = JSON.stringify(query);
      const resultFound = data && data.length > 0;
      await this.touchpointService.logUser(user.username, 'Touchpoints', queryAsString, fullUrl, resultFound);


      if (!data || data.length === 0) {
        return res.status(HttpStatus.NOT_FOUND).json({
          status_code: HttpStatus.NOT_FOUND,
          message: `No data found with provided filters.`,
        });
      }

      //Calculates the next offset (we need this for our pagination) and also checks if we even have a next page (this will come in handy later)
      const nextOffset = offset + limit;
      const hasNextPage = nextOffset < total;

      //Here we set up the query part of the next url, we check for each key if its value is not empty/null so we only keep-
      //the query parameters that we will actually use in our next url
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

      //Here we create the variable that contains either the next url or null (incase hasNextPage is false)
      const nextPageUrl = hasNextPage
        ? `http://localhost:3000/${controllerName}?${queryParams.toString()}`
        : null;

      //This just transfers the entity to JSON format so we can return it later
      const plainList = data.map((item) => instanceToPlain(item));

      //Here we give the full response message, in case of an error there will be an error message instead of the full response
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
  @Get('protected/:FlightID')
  @ApiOperation({
    summary: 'Get single touchpoint by FlightID',
    description: 'Returns a single row from SQL Touchpoints by FlightID',
  })


  async getById(@Param('FlightID') FlightID: string, @Res() res: Response) {

    //Here we check if the ID is a number, if not we return a Bad Request response
    const numericId = parseInt(FlightID, 10);
    if (isNaN(numericId)) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        status_code: HttpStatus.BAD_REQUEST,
        message: 'Invalid ID provided.',
      });
    }

    //In case we ARE working with a valid ID, we use the findOneById method from touchpoints.service.ts
    //Yet again if there is no result found we return a Not Found response
    const result = await this.touchpointService.findOneById(numericId);
    if (!result) {
      return res.status(HttpStatus.NOT_FOUND).json({
        status_code: HttpStatus.NOT_FOUND,
        message: `Touchpoint with ID ${FlightID} not found.`,
      });
    }

    //This just transfers the entity to JSON format so we can return it later
    const plain = instanceToPlain(result);

    //This responds with the found data
    return res.status(HttpStatus.OK).json({
      status: HttpStatus.OK,
      message: 'Touchpoint found!',
      data: plain,
    });
  }
}
