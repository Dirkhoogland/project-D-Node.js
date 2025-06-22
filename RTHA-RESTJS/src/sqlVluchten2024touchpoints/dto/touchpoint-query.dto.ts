import { ApiPropertyOptional } from '@nestjs/swagger';
import {
    IsNumber,
    IsString,
    IsDate,
    IsOptional,
} from 'class-validator';
import { Transform } from 'class-transformer';

function parseFlexibleDate(value: string): Date | undefined {
    if (!value || typeof value !== 'string') return undefined;
    const trimmed = value.trim();
    if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) {
        return new Date(`${trimmed}T00:00:00.000Z`);
    }
    if (/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/.test(trimmed)) {
        return new Date(trimmed.replace(' ', 'T') + 'Z');
    }
    if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{1,3})?Z$/.test(trimmed)) {
        return new Date(trimmed);
    }
    const parsed = new Date(trimmed);
    return isNaN(parsed.getTime()) ? undefined : parsed;
}

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
    @Transform(({ value }) => parseFlexibleDate(value))
    @IsOptional()
    @IsDate()
    ScheduledLocal?: Date;

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
    @Transform(({ value }) => parseFlexibleDate(value))
    @IsOptional()
    @IsDate()
    TouchpointTime?: Date;

    @ApiPropertyOptional()
    @Transform(({ value }) => value !== undefined ? Number(value) : value)
    @IsNumber()
    TouchpointPax?: number;

    @ApiPropertyOptional()
    @Transform(({ value }) => parseFlexibleDate(value))
    @IsOptional()
    @IsDate()
    ActualLocal?: Date;

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
