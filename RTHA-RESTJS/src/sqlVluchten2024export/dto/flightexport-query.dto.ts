import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
    IsString,
    IsNumber,
    IsBoolean,
    IsDateString,
} from 'class-validator';

export class FlightExportQueryDto {
    @ApiPropertyOptional()
    @IsString()
    Type?: string;

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
    TrafficType?: string;

    @ApiPropertyOptional()
    @IsString()
    FlightNumber?: string;

    @ApiPropertyOptional()
    @IsBoolean()
    @Transform(({ value }) => value === 'true' ? true : value === 'false' ? false : value)
    Diverted?: boolean;

    @ApiPropertyOptional()
    @IsBoolean()
    @Transform(({ value }) => value === 'true' ? true : value === 'false' ? false : value)
    Nachtvlucht?: boolean;

    @ApiPropertyOptional()
    @Transform(({ value }) => value !== undefined ? Number(value) : value)
    @IsNumber()
    FlightCode?: number;

    @ApiPropertyOptional()
    @IsString()
    FlightCodeDescription?: string;

    @ApiPropertyOptional()
    @IsString()
    FlightCodeIATA?: string;

    @ApiPropertyOptional()
    @IsBoolean()
    @Transform(({ value }) => value === 'true' ? true : value === 'false' ? false : value)
    PublicAnnouncement?: boolean;

    @ApiPropertyOptional()
    @IsDateString()
    ScheduledUTC?: string;

    @ApiPropertyOptional()
    @IsDateString()
    ActualUTC?: string;

    @ApiPropertyOptional()
    @IsDateString()
    ScheduledLocal?: string;

    @ApiPropertyOptional()
    @IsDateString()
    ActualLocal?: string;

    @ApiPropertyOptional()
    @Transform(({ value }) => value !== undefined ? Number(value) : value)
    @IsNumber()
    Bewegingen?: number;

    @ApiPropertyOptional()
    @IsString()
    Parkeerpositie?: string;

    @ApiPropertyOptional()
    @IsString()
    Parkeercontract?: string;

    @ApiPropertyOptional()
    @IsBoolean()
    @Transform(({ value }) => value === 'true' ? true : value === 'false' ? false : value)
    Bus?: boolean;

    @ApiPropertyOptional()
    @Transform(({ value }) => value !== undefined ? Number(value) : value)
    @IsNumber()
    Gate?: number;

    @ApiPropertyOptional()
    @Transform(({ value }) => value !== undefined ? Number(value) : value)
    @IsNumber()
    Bagageband?: number;

    @ApiPropertyOptional()
    @IsString()
    AirportICAO?: string;

    @ApiPropertyOptional()
    @IsString()
    Airport?: string;

    @ApiPropertyOptional()
    @IsString()
    Country?: string;

    @ApiPropertyOptional()
    @IsString()
    ViaAirportICAO?: string;

    @ApiPropertyOptional()
    @IsString()
    ViaAirport?: string;

    @ApiPropertyOptional()
    @IsString()
    AircraftRegistration?: string;

    @ApiPropertyOptional()
    @Transform(({ value }) => value !== undefined ? Number(value) : value)
    @IsNumber()
    Seats?: number;

    @ApiPropertyOptional()
    @Transform(({ value }) => value !== undefined ? Number(value) : value)
    @IsNumber()
    MTOW?: number;

    @ApiPropertyOptional()
    @IsString()
    AircraftType?: string;

    @ApiPropertyOptional()
    @IsString()
    AircraftDescription?: string;

    @ApiPropertyOptional()
    @IsBoolean()
    @Transform(({ value }) => value === 'true' ? true : value === 'false' ? false : value)
    EU?: boolean;

    @ApiPropertyOptional()
    @IsBoolean()
    @Transform(({ value }) => value === 'true' ? true : value === 'false' ? false : value)
    Schengen?: boolean;

    @ApiPropertyOptional()
    @IsString()
    AirlineFullname?: string;

    @ApiPropertyOptional()
    @IsString()
    AirlineShortname?: string;

    @ApiPropertyOptional()
    @IsString()
    AirlineICAO?: string;

    @ApiPropertyOptional()
    @IsString()
    AirlineIATA?: string;

    @ApiPropertyOptional()
    @IsString()
    Debiteur?: string;

    @ApiPropertyOptional()
    @Transform(({ value }) => value !== undefined ? Number(value) : value)
    @IsNumber()
    DebiteurNr?: number;

    @ApiPropertyOptional()
    @Transform(({ value }) => value !== undefined ? Number(value) : value)
    @IsNumber()
    PaxMale?: number;

    @ApiPropertyOptional()
    @Transform(({ value }) => value !== undefined ? Number(value) : value)
    @IsNumber()
    PaxFemale?: number;

    @ApiPropertyOptional()
    @Transform(({ value }) => value !== undefined ? Number(value) : value)
    @IsNumber()
    PaxChild?: number;

    @ApiPropertyOptional()
    @Transform(({ value }) => value !== undefined ? Number(value) : value)
    @IsNumber()
    PaxInfant?: number;

    @ApiPropertyOptional()
    @Transform(({ value }) => value !== undefined ? Number(value) : value)
    @IsNumber()
    PaxTransitMale?: number;

    @ApiPropertyOptional()
    @Transform(({ value }) => value !== undefined ? Number(value) : value)
    @IsNumber()
    PaxTransitFemale?: number;

    @ApiPropertyOptional()
    @Transform(({ value }) => value !== undefined ? Number(value) : value)
    @IsNumber()
    PaxTransitChild?: number;

    @ApiPropertyOptional()
    @Transform(({ value }) => value !== undefined ? Number(value) : value)
    @IsNumber()
    PaxTransitInfant?: number;

    @ApiPropertyOptional()
    @Transform(({ value }) => value !== undefined ? Number(value) : value)
    @IsNumber()
    CrewCabin?: number;

    @ApiPropertyOptional()
    @Transform(({ value }) => value !== undefined ? Number(value) : value)
    @IsNumber()
    CrewCockpit?: number;

    @ApiPropertyOptional()
    @Transform(({ value }) => value !== undefined ? Number(value) : value)
    @IsNumber()
    BagsWeight?: number;

    @ApiPropertyOptional()
    @Transform(({ value }) => value !== undefined ? Number(value) : value)
    @IsNumber()
    BagsTransitWeight?: number;

    @ApiPropertyOptional()
    @Transform(({ value }) => value !== undefined ? Number(value) : value)
    @IsNumber()
    BagsTransit?: number;

    @ApiPropertyOptional()
    @Transform(({ value }) => value !== undefined ? Number(value) : value)
    @IsNumber()
    Bags?: number;

    @ApiPropertyOptional()
    @IsString()
    Afhandelaar?: string;

    @ApiPropertyOptional()
    @Transform(({ value }) => value !== undefined ? Number(value) : value)
    @IsNumber()
    ForecastPercentage?: number;

    @ApiPropertyOptional()
    @Transform(({ value }) => value !== undefined ? Number(value) : value)
    @IsNumber()
    ForecastPax?: number;

    @ApiPropertyOptional()
    @Transform(({ value }) => value !== undefined ? Number(value) : value)
    @IsNumber()
    ForecastBabys?: number;

    @ApiPropertyOptional()
    @IsString()
    FlightClass?: string;

    @ApiPropertyOptional()
    @IsString()
    Datasource?: string;

    @ApiPropertyOptional()
    @Transform(({ value }) => value !== undefined ? Number(value) : value)
    @IsNumber()
    TotaalPax?: number;

    @ApiPropertyOptional()
    @Transform(({ value }) => value !== undefined ? Number(value) : value)
    @IsNumber()
    TerminalPax?: number;

    @ApiPropertyOptional()
    @Transform(({ value }) => value !== undefined ? Number(value) : value)
    @IsNumber()
    TotaalPaxBetalend?: number;

    @ApiPropertyOptional()
    @Transform(({ value }) => value !== undefined ? Number(value) : value)
    @IsNumber()
    TerminalPaxBetalend?: number;

    @ApiPropertyOptional()
    @Transform(({ value }) => value !== undefined ? Number(value) : value)
    @IsNumber()
    TransitPax?: number;

    @ApiPropertyOptional()
    @Transform(({ value }) => value !== undefined ? Number(value) : value)
    @IsNumber()
    TransitPaxBetalend?: number;

    @ApiPropertyOptional()
    @Transform(({ value }) => value !== undefined ? Number(value) : value)
    @IsNumber()
    TotaalCrew?: number;

    @ApiPropertyOptional()
    @Transform(({ value }) => value !== undefined ? Number(value) : value)
    @IsNumber()
    TerminalCrew?: number;

    @ApiPropertyOptional()
    @Transform(({ value }) => value !== undefined ? Number(value) : value)
    @IsNumber()
    TotaalSeats?: number;

    @ApiPropertyOptional()
    @Transform(({ value }) => value !== undefined ? Number(value) : value)
    @IsNumber()
    TerminalSeats?: number;

    @ApiPropertyOptional()
    @Transform(({ value }) => value !== undefined ? Number(value) : value)
    @IsNumber()
    TotaalBags?: number;

    @ApiPropertyOptional()
    @Transform(({ value }) => value !== undefined ? Number(value) : value)
    @IsNumber()
    TerminalBags?: number;

    @ApiPropertyOptional()
    @Transform(({ value }) => value !== undefined ? Number(value) : value)
    @IsNumber()
    TransitBags?: number;

    @ApiPropertyOptional()
    @Transform(({ value }) => value !== undefined ? Number(value) : value)
    @IsNumber()
    TotaalBagsWeight?: number;

    @ApiPropertyOptional()
    @Transform(({ value }) => value !== undefined ? Number(value) : value)
    @IsNumber()
    TerminalBagsWeight?: number;

    @ApiPropertyOptional()
    @Transform(({ value }) => value !== undefined ? Number(value) : value)
    @IsNumber()
    TransitBagsWeight?: number;

    @ApiPropertyOptional()
    @IsString()
    Runway?: string;

    @ApiPropertyOptional()
    @Transform(({ value }) => value !== undefined ? Number(value) : value)
    @IsNumber()
    Longitude?: number;

    @ApiPropertyOptional()
    @Transform(({ value }) => value !== undefined ? Number(value) : value)
    @IsNumber()
    Elevation?: number;

    @ApiPropertyOptional()
    @Transform(({ value }) => value !== undefined ? Number(value) : value)
    @IsNumber()
    Latitude?: number;

    @ApiPropertyOptional()
    @Transform(({ value }) => value !== undefined ? Number(value) : value)
    @IsNumber()
    DistanceKilometers?: number;

    @ApiPropertyOptional()
    @IsString()
    Direction?: string;

    @ApiPropertyOptional()
    @IsString()
    AirportIATA?: string;

    @ApiPropertyOptional()
    @IsString()
    Forecast?: string;

    @ApiPropertyOptional()
    @Transform(({ value }) => value !== undefined ? Number(value) : value)
    @IsNumber()
    Parked?: number;

    @ApiPropertyOptional()
    @IsString()
    Seizoen?: string;

    @ApiPropertyOptional()
    @IsString()
    Feestdag?: string;

    @ApiPropertyOptional()
    @Transform(({ value }) => value !== undefined ? Number(value) : value)
    @IsNumber()
    limit?: number;

    @ApiPropertyOptional()
    @Transform(({ value }) => value !== undefined ? Number(value) : value)
    @IsNumber()
    offset?: number;
}
