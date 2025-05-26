import { ApiPropertyOptional } from '@nestjs/swagger';
import {
    IsOptional,
    IsString,
    IsNumber,
    IsBoolean,
    IsDateString,
} from 'class-validator';

export class FlightExportQueryDto {
    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    Type?: string;

    @IsOptional() @IsNumber()
    FlightID?: number;

    @IsOptional() @IsNumber()
    TimetableID?: number;

    @IsOptional() @IsString()
    TrafficType?: string;

    @IsOptional() @IsString()
    FlightNumber?: string;

    @IsOptional() @IsBoolean()
    Diverted?: boolean;

    @IsOptional() @IsBoolean()
    Nachtvlucht?: boolean;

    @IsOptional() @IsNumber()
    FlightCode?: number;

    @IsOptional() @IsString()
    FlightCodeDescription?: string;

    @IsOptional() @IsString()
    FlightCodeIATA?: string;

    @IsOptional() @IsBoolean()
    PublicAnnouncement?: boolean;

    @IsOptional() @IsDateString()
    ScheduledUTC?: string;

    @IsOptional() @IsDateString()
    ActualUTC?: string;

    @IsOptional() @IsDateString()
    ScheduledLocal?: string;

    @IsOptional() @IsDateString()
    ActualLocal?: string;

    @IsOptional() @IsNumber()
    Bewegingen?: number;

    @IsOptional() @IsString()
    Parkeerpositie?: string;

    @IsOptional() @IsString()
    Parkeercontract?: string;

    @IsOptional() @IsBoolean()
    Bus?: boolean;

    @IsOptional() @IsNumber()
    Gate?: number;

    @IsOptional() @IsNumber()
    Bagageband?: number;

    @IsOptional() @IsString()
    AirportICAO?: string;

    @IsOptional() @IsString()
    Airport?: string;

    @IsOptional() @IsString()
    Country?: string;

    @IsOptional() @IsString()
    ViaAirportICAO?: string;

    @IsOptional() @IsString()
    ViaAirport?: string;

    @IsOptional() @IsString()
    AircraftRegistration?: string;

    @IsOptional() @IsNumber()
    Seats?: number;

    @IsOptional() @IsNumber()
    MTOW?: number;

    @IsOptional() @IsString()
    AircraftType?: string;

    @IsOptional() @IsString()
    AircraftDescription?: string;

    @IsOptional() @IsBoolean()
    EU?: boolean;

    @IsOptional() @IsBoolean()
    Schengen?: boolean;

    @IsOptional() @IsString()
    AirlineFullname?: string;

    @IsOptional() @IsString()
    AirlineShortname?: string;

    @IsOptional() @IsString()
    AirlineICAO?: string;

    @IsOptional() @IsString()
    AirlineIATA?: string;

    @IsOptional() @IsString()
    Debiteur?: string;

    @IsOptional() @IsNumber()
    DebiteurNr?: number;

    @IsOptional() @IsNumber()
    PaxMale?: number;

    @IsOptional() @IsNumber()
    PaxFemale?: number;

    @IsOptional() @IsNumber()
    PaxChild?: number;

    @IsOptional() @IsNumber()
    PaxInfant?: number;

    @IsOptional() @IsNumber()
    PaxTransitMale?: number;

    @IsOptional() @IsNumber()
    PaxTransitFemale?: number;

    @IsOptional() @IsNumber()
    PaxTransitChild?: number;

    @IsOptional() @IsNumber()
    PaxTransitInfant?: number;

    @IsOptional() @IsNumber()
    CrewCabin?: number;

    @IsOptional() @IsNumber()
    CrewCockpit?: number;

    @IsOptional() @IsNumber()
    BagsWeight?: number;

    @IsOptional() @IsNumber()
    BagsTransitWeight?: number;

    @IsOptional() @IsNumber()
    BagsTransit?: number;

    @IsOptional() @IsNumber()
    Bags?: number;

    @IsOptional() @IsString()
    Afhandelaar?: string;

    @IsOptional() @IsNumber()
    ForecastPercentage?: number;

    @IsOptional() @IsNumber()
    ForecastPax?: number;

    @IsOptional() @IsNumber()
    ForecastBabys?: number;

    @IsOptional() @IsString()
    FlightClass?: string;

    @IsOptional() @IsString()
    Datasource?: string;

    @IsOptional() @IsNumber()
    TotaalPax?: number;

    @IsOptional() @IsNumber()
    TerminalPax?: number;

    @IsOptional() @IsNumber()
    TotaalPaxBetalend?: number;

    @IsOptional() @IsNumber()
    TerminalPaxBetalend?: number;

    @IsOptional() @IsNumber()
    TransitPax?: number;

    @IsOptional() @IsNumber()
    TransitPaxBetalend?: number;

    @IsOptional() @IsNumber()
    TotaalCrew?: number;

    @IsOptional() @IsNumber()
    TerminalCrew?: number;

    @IsOptional() @IsNumber()
    TotaalSeats?: number;

    @IsOptional() @IsNumber()
    TerminalSeats?: number;

    @IsOptional() @IsNumber()
    TotaalBags?: number;

    @IsOptional() @IsNumber()
    TerminalBags?: number;

    @IsOptional() @IsNumber()
    TransitBags?: number;

    @IsOptional() @IsNumber()
    TotaalBagsWeight?: number;

    @IsOptional() @IsNumber()
    TerminalBagsWeight?: number;

    @IsOptional() @IsNumber()
    TransitBagsWeight?: number;

    @IsOptional() @IsString()
    Runway?: string;

    @IsOptional() @IsNumber()
    Longitude?: number;

    @IsOptional() @IsNumber()
    Elevation?: number;

    @IsOptional() @IsNumber()
    Latitude?: number;

    @IsOptional() @IsNumber()
    DistanceKilometers?: number;

    @IsOptional() @IsString()
    Direction?: string;

    @IsOptional() @IsString()
    AirportIATA?: string;

    @IsOptional() @IsString()
    Forecast?: string;

    @IsOptional() @IsNumber()
    Parked?: number;

    @IsOptional() @IsString()
    Seizoen?: string;

    @IsOptional() @IsString()
    Feestdag?: string;

    @IsOptional()
    @IsNumber()
    limit?: number;

    @IsOptional()
    @IsNumber()
    offset?: number;
}
