import { ApiPropertyOptional } from '@nestjs/swagger';
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
    @IsNumber()
    FlightID?: number;

    @ApiPropertyOptional()
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
    Diverted?: boolean;

    @ApiPropertyOptional()
    @IsBoolean()
    Nachtvlucht?: boolean;

    @ApiPropertyOptional()
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
    Bus?: boolean;

    @ApiPropertyOptional()
    @IsNumber()
    Gate?: number;

    @ApiPropertyOptional()
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
    @IsNumber()
    Seats?: number;

    @ApiPropertyOptional()
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
    EU?: boolean;

    @ApiPropertyOptional()
    @IsBoolean()
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
    @IsNumber()
    DebiteurNr?: number;

    @ApiPropertyOptional()
    @IsNumber()
    PaxMale?: number;

    @ApiPropertyOptional()
    @IsNumber()
    PaxFemale?: number;

    @ApiPropertyOptional()
    @IsNumber()
    PaxChild?: number;

    @ApiPropertyOptional()
    @IsNumber()
    PaxInfant?: number;

    @ApiPropertyOptional()
    @IsNumber()
    PaxTransitMale?: number;

    @ApiPropertyOptional()
    @IsNumber()
    PaxTransitFemale?: number;

    @ApiPropertyOptional()
    @IsNumber()
    PaxTransitChild?: number;

    @ApiPropertyOptional()
    @IsNumber()
    PaxTransitInfant?: number;

    @ApiPropertyOptional()
    @IsNumber()
    CrewCabin?: number;

    @ApiPropertyOptional()
    @IsNumber()
    CrewCockpit?: number;

    @ApiPropertyOptional()
    @IsNumber()
    BagsWeight?: number;

    @ApiPropertyOptional()
    @IsNumber()
    BagsTransitWeight?: number;

    @ApiPropertyOptional()
    @IsNumber()
    BagsTransit?: number;

    @ApiPropertyOptional()
    @IsNumber()
    Bags?: number;

    @ApiPropertyOptional()
    @IsString()
    Afhandelaar?: string;

    @ApiPropertyOptional()
    @IsNumber()
    ForecastPercentage?: number;

    @ApiPropertyOptional()
    @IsNumber()
    ForecastPax?: number;

    @ApiPropertyOptional()
    @IsNumber()
    ForecastBabys?: number;

    @ApiPropertyOptional()
    @IsString()
    FlightClass?: string;

    @ApiPropertyOptional()
    @IsString()
    Datasource?: string;

    @ApiPropertyOptional()
    @IsNumber()
    TotaalPax?: number;

    @ApiPropertyOptional()
    @IsNumber()
    TerminalPax?: number;

    @ApiPropertyOptional()
    @IsNumber()
    TotaalPaxBetalend?: number;

    @ApiPropertyOptional()
    @IsNumber()
    TerminalPaxBetalend?: number;

    @ApiPropertyOptional()
    @IsNumber()
    TransitPax?: number;

    @ApiPropertyOptional()
    @IsNumber()
    TransitPaxBetalend?: number;

    @ApiPropertyOptional()
    @IsNumber()
    TotaalCrew?: number;

    @ApiPropertyOptional()
    @IsNumber()
    TerminalCrew?: number;

    @ApiPropertyOptional()
    @IsNumber()
    TotaalSeats?: number;

    @ApiPropertyOptional()
    @IsNumber()
    TerminalSeats?: number;

    @ApiPropertyOptional()
    @IsNumber()
    TotaalBags?: number;

    @ApiPropertyOptional()
    @IsNumber()
    TerminalBags?: number;

    @ApiPropertyOptional()
    @IsNumber()
    TransitBags?: number;

    @ApiPropertyOptional()
    @IsNumber()
    TotaalBagsWeight?: number;

    @ApiPropertyOptional()
    @IsNumber()
    TerminalBagsWeight?: number;

    @ApiPropertyOptional()
    @IsNumber()
    TransitBagsWeight?: number;

    @ApiPropertyOptional()
    @IsString()
    Runway?: string;

    @ApiPropertyOptional()
    @IsNumber()
    Longitude?: number;

    @ApiPropertyOptional()
    @IsNumber()
    Elevation?: number;

    @ApiPropertyOptional()
    @IsNumber()
    Latitude?: number;

    @ApiPropertyOptional()
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
    @IsNumber()
    Parked?: number;

    @ApiPropertyOptional()
    @IsString()
    Seizoen?: string;

    @ApiPropertyOptional()
    @IsString()
    Feestdag?: string;

    @ApiPropertyOptional()
    @IsNumber()
    limit?: number;

    @ApiPropertyOptional()
    @IsNumber()
    offset?: number;
}
