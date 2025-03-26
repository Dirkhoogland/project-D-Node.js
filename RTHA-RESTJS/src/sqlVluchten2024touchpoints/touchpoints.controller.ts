import { Controller, Get, Param, Res, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { TouchpointService as TouchpointService } from './touchpoints.service';
import { Response } from 'express';
import { Sanitizer } from 'src/overarching-funcs/sanitize-inputs';

const controllerName = 'touchpoints';

@ApiTags('RTHA-API')
@Controller(controllerName)
export class TouchpointController {
  constructor(private readonly touchpointService: TouchpointService) { }

  @Get(':Airline/:Country/:Touchpoint')
  @ApiOperation({ summary: 'Test API with SQL-Touchpoints database', description: 'Returns data from SQL "Touchpoints" database.' })
  async getFlight(
    @Param('Airline') airline: string,
    @Param('Country') country: string,
    @Param('Touchpoint') touchpoint: string,
    @Res() res: Response) {
    var result;
    try {
      result = await this.touchpointService.findByAirlineCountryTouchpoint(
        Sanitizer.removeNonAlphanumeric(airline),
        Sanitizer.removeNonAlphanumeric(country),
        Sanitizer.removeNonAlphanumeric(touchpoint));

    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        status_code: HttpStatus.INTERNAL_SERVER_ERROR,
        message: `The server has encountered a problem.`
      });
    }

    if (!result) {
      return res.status(HttpStatus.NOT_FOUND).json({
        status_code: HttpStatus.NOT_FOUND,
        message: `No data found for ${airline}, ${country}, ${touchpoint}`
      });
    }
    return res.status(HttpStatus.OK).json({
      status: HttpStatus.OK,
      message: "Success!",
      name: "RTHA-TEST-SQL-API",
      format: "JSON",
      prompts: `Airline: ${airline}, Country: ${country}, Touchpoint: ${touchpoint}`,
      url: `http://localhost:3000/${controllerName}/${airline}/${country}/${touchpoint}`,
      data: result,

    });
  }
}
