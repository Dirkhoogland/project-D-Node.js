import { Controller, Get, Param, Res, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { FlightExportService } from './flightexport.service';
import { Response } from 'express';

const controllerName = 'flightExport';

@ApiTags('RTHA-API')
@Controller(controllerName)
export class FlightExportController {
  constructor(private readonly flightExportService: FlightExportService) { }

  @Get(':Registration')
  @ApiOperation({ summary: 'Test API with SQL-Export database', description: 'Returns data from SQL "Export" database.' })
  async getFlight(
    @Param('Registration') registration: string,
    @Res() res: Response) {
    registration = registration.trim()
    var result;
    try {
      result = await this.flightExportService.findByRegistration(registration);

    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        status_code: HttpStatus.INTERNAL_SERVER_ERROR,
        message: `The server has encountered a problem.`
      });
    }

    if (!result) {
      return res.status(HttpStatus.NOT_FOUND).json({
        status_code: HttpStatus.NOT_FOUND,
        message: `No flight data found for prompt ${registration}`
      });
    }
    return res.status(HttpStatus.OK).json({
      status: HttpStatus.OK,
      message: "Success!",
      name: "RTHA-TEST-FLIGHTEXPORT-SQL-API",
      format: "JSON",
      prompts: `Registration: ${registration}`,
      url: `http://localhost:3000/${controllerName}/${registration}`,
      data: result,

    });
  }
}
