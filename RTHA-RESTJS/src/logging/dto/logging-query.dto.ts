import { IsOptional, IsString, IsDateString, IsNumber } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UserLogDto {
    @ApiPropertyOptional({ description: 'Username to filter logs by' })
    @IsOptional()
    @IsString()
    username?: string;

    @ApiPropertyOptional({ description: 'Database name' })
    @IsOptional()
    @IsString()
    database?: string;

    @ApiPropertyOptional({ description: 'HTTP method used' })
    @IsOptional()
    @IsString()
    httpMethod?: string;

    @ApiPropertyOptional({ description: 'HTTP response code' })
    @IsOptional()
    @IsNumber()
    responseCode?: number;

    @ApiPropertyOptional({ description: 'Start date for logs (ISO 8601)' })
    @IsOptional()
    @IsDateString()
    startDate?: string;

    @ApiPropertyOptional({ description: 'End date for logs (ISO 8601)' })
    @IsOptional()
    @IsDateString()
    endDate?: string;
}
