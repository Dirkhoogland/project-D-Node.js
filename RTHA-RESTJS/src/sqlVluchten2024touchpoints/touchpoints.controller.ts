import { Controller, Get, Query, HttpStatus, UseGuards, NotFoundException, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { TouchpointService } from './touchpoints.service';
import { TouchpointQueryDto } from './dto/touchpoint-query.dto';
import { Sanitizer } from 'src/overarching-funcs/sanitize-inputs';
import { AuthGuard } from '@nestjs/passport';

const controllerName = 'touchpoints';

@ApiTags('RTHA-API')
@Controller(controllerName)
export class TouchpointController {
  constructor(private readonly touchpointService: TouchpointService) {}

  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('jwt')
  @Get('protected')
  @ApiOperation({
    summary: 'Query SQL-Touchpoints database with flexible filters',
    description: 'Returns filtered data from SQL "Touchpoints" database.',
  })
  async getFilteredTouchpoints(
    @Query() query: TouchpointQueryDto,
    @Request() req, // Added to access user info from the token if needed
  ) {
    const user = req.user; // Access authenticated user (optional)
    console.log('Authenticated user:', user); // Debug line to check user details

    const sanitizedFilters = Object.fromEntries(
      Object.entries(query).map(([key, value]) => [
        key,
        typeof value === 'string' ? Sanitizer.removeNonAlphanumeric(value) : value,
      ]),
    );

    try {
      const result = await this.touchpointService.findWithFilters(sanitizedFilters);

      if (!result || result.length === 0) {
        throw new NotFoundException('No data found with provided filters.');
      }

      return {
        status: HttpStatus.OK,
        message: 'Success!',
        name: 'RTHA-TOUCHPOINTS-API',
        format: 'JSON',
        query,
        url: `http://localhost:3000/${controllerName}?...`,
        data: result,
      };
    } catch (error) {
      // NestJS will handle any errors, so no need to manually set status codes
      throw new Error('The server has encountered a problem.');
    }
  }
}
