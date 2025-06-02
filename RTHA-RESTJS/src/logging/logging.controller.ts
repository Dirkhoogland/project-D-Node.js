import {
    Controller,
    Get,
    UseGuards,
    Query,
    Res,
    Req,
    HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth } from '@nestjs/swagger';
import { UserLogDto } from './dto/logging-query.dto';
import { LoggingService } from './logging.service';
import { Response, Request } from 'express';
import { Role } from 'src/auth/Roles/role.enum';
import { Roles } from 'src/auth/Roles/role.decorator';
import { RolesGuard } from 'src/auth/Roles/role.guard';

const controllerName = 'logs';

@ApiTags('RTHA-API')
@Controller(controllerName)
export class LoggingController {
    constructor(private readonly loggingService: LoggingService) { }

    @Get()
    @Roles(Role.ADMIN)
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @ApiBearerAuth('jwt')
    @ApiOperation({
        summary: 'Get user logs for the API',
        description: 'Returns the user logs filtered by username, database, HTTP method, response code and date range',
    })
    async getUserLogs(
        @Query() query: UserLogDto,
        @Res() res: Response,
        @Req() req: Request,
    ) {
        const logs = await this.loggingService.findLogs(query);

        return res.status(200).json({
            status: 200,
            message: 'User logs retrieved',
            data: logs,
        });
    }
}
