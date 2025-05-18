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
      const { data, total } = await this.flightExportService.findWithFilters(
        filters,
        limit,
        offset,
      );


      //Checks if what findWithFilters returned is not empty/null, if it is we give return that nothing was found this the provided filters
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

    //Here we check if the ID is a number, if not we return a Bad Request response
    const numericId = parseInt(FlightID, 10);
    if (isNaN(numericId)) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        status_code: HttpStatus.BAD_REQUEST,
        message: 'Invalid FlightID provided.',
      });
    }

    //In case we ARE working with a valid ID, we use the findOneById method from flightexport.service.ts
    //Yet again if there is no result found we return a Not Found response
    const result = await this.flightExportService.findOneById(numericId);
    if (!result) {
      return res.status(HttpStatus.NOT_FOUND).json({
        status_code: HttpStatus.NOT_FOUND,
        message: `Flight export with ID ${FlightID} not found.`,
      });
    }

    //This just transfers the entity to JSON format so we can return it later
    const plain = instanceToPlain(result);


    //This responds with the found data
    return res.status(HttpStatus.OK).json({
      status: HttpStatus.OK,
      message: 'Flight found!',
      data: plain,
    });
  }
}
