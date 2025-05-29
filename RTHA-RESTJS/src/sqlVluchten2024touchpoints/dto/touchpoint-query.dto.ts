import { ApiPropertyOptional } from '@nestjs/swagger';
import {
    IsNumber,
    IsString,
    IsDateString,
} from 'class-validator';

export class TouchpointQueryDto {
    @ApiPropertyOptional()
    @IsNumber()
    FlightID?: number;

    @ApiPropertyOptional()
    @IsNumber()
    TimetableID?: number;

    @ApiPropertyOptional()
    @IsString()
    FlightNumber?: string;

    @ApiPropertyOptional()
    @IsString()
    TrafficType?: string;

    @ApiPropertyOptional()
    @IsDateString()
    ScheduledLocal?: string;

    @ApiPropertyOptional()
    @IsString()
    AirlineShortname?: string;

    @ApiPropertyOptional()
    @IsString()
    AircraftType?: string;

    @ApiPropertyOptional()
    @IsString()
    Airport?: string;

    @ApiPropertyOptional()
    @IsString()
    Country?: string;

    @ApiPropertyOptional()
    @IsNumber()
    PaxForecast?: number;

    @ApiPropertyOptional()
    @IsString()
    Touchpoint?: string;

    @ApiPropertyOptional()
    @IsDateString()
    TouchpointTime?: string;

    @ApiPropertyOptional()
    @IsNumber()
    TouchpointPax?: number;

    @ApiPropertyOptional()
    @IsDateString()
    ActualLocal?: string;

    @ApiPropertyOptional()
    @IsNumber()
    PaxActual?: number;

    @ApiPropertyOptional({ description: 'Aantal resultaten per pagina' })
    @IsNumber()
    limit?: number;

    @ApiPropertyOptional({ description: 'Aantal over te slaan resultaten (offset)' })
    @IsNumber()
    offset?: number;
}
