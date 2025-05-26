import { ApiPropertyOptional } from '@nestjs/swagger';
import {
    IsOptional,
    IsNumber,
    IsString,
    IsDateString,
} from 'class-validator';

export class TouchpointQueryDto {
    @ApiPropertyOptional()
    @IsOptional()
    @IsNumber()
    FlightID?: number;

    @ApiPropertyOptional()
    @IsOptional()
    @IsNumber()
    TimetableID?: number;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    FlightNumber?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    TrafficType?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsDateString()
    ScheduledLocal?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    AirlineShortname?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    AircraftType?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    Airport?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    Country?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsNumber()
    PaxForecast?: number;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    Touchpoint?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsDateString()
    TouchpointTime?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsNumber()
    TouchpointPax?: number;

    @ApiPropertyOptional()
    @IsOptional()
    @IsDateString()
    ActualLocal?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsNumber()
    PaxActual?: number;

    @ApiPropertyOptional({ description: 'Aantal resultaten per pagina' })
    @IsOptional()
    @IsNumber()
    limit?: number;

    @ApiPropertyOptional({ description: 'Aantal over te slaan resultaten (offset)' })
    @IsOptional()
    @IsNumber()
    offset?: number;
}
