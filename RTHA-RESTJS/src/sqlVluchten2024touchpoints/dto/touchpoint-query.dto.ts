import { ApiPropertyOptional } from '@nestjs/swagger';

export class TouchpointQueryDto {
    @ApiPropertyOptional() FlightID?: number;
    @ApiPropertyOptional() TimetableID?: number;
    @ApiPropertyOptional() FlightNumber?: string;
    @ApiPropertyOptional() TrafficType?: string;
    @ApiPropertyOptional() ScheduledLocal?: Date;
    @ApiPropertyOptional() AirlineShortname?: string;
    @ApiPropertyOptional() AircraftType?: string;
    @ApiPropertyOptional() Airport?: string;
    @ApiPropertyOptional() Country?: string;
    @ApiPropertyOptional() PaxForecast?: number;
    @ApiPropertyOptional() Touchpoint?: string;
    @ApiPropertyOptional() TouchpointTime?: Date;
    @ApiPropertyOptional() TouchpointPax?: number;
    @ApiPropertyOptional() ActualLocal?: Date;
    @ApiPropertyOptional() PaxActual?: number;
    @ApiPropertyOptional({ description: 'Aantal resultaten per pagina' }) limit?: number;
    @ApiPropertyOptional({ description: 'Aantal over te slaan resultaten (offset)' }) offset?: number;
}
