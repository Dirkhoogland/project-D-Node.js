import { ApiPropertyOptional } from '@nestjs/swagger';
import {
    IsNumber,
    IsString,
    IsDateString,
} from 'class-validator';
import { Transform } from 'class-transformer';

export class TouchpointQueryDto {
    @ApiPropertyOptional()
    @Transform(({ value }) => value !== undefined ? Number(value) : value)
    @IsNumber()
    FlightID?: number;

    @ApiPropertyOptional()
    @Transform(({ value }) => value !== undefined ? Number(value) : value)
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
    @Transform(({ value }) => value !== undefined ? Number(value) : value)
    @IsNumber()
    PaxForecast?: number;

    @ApiPropertyOptional()
    @IsString()
    Touchpoint?: string;

    @ApiPropertyOptional()
    @IsDateString()
    TouchpointTime?: string;

    @ApiPropertyOptional()
    @Transform(({ value }) => value !== undefined ? Number(value) : value)
    @IsNumber()
    TouchpointPax?: number;

    @ApiPropertyOptional()
    @IsDateString()
    ActualLocal?: string;

    @ApiPropertyOptional()
    @Transform(({ value }) => value !== undefined ? Number(value) : value)
    @IsNumber()
    PaxActual?: number;

    @ApiPropertyOptional({ description: 'Aantal resultaten per pagina' })
    @Transform(({ value }) => value !== undefined ? Number(value) : value)
    @IsNumber()
    limit?: number;

    @ApiPropertyOptional({ description: 'Aantal over te slaan resultaten (offset)' })
    @Transform(({ value }) => value !== undefined ? Number(value) : value)
    @IsNumber()
    offset?: number;
}
