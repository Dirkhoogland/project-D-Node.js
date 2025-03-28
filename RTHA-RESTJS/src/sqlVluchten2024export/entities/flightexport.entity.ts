import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('Vluchten2024export')
export class FlightExportEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    Type: string;

    @Column()
    FlightID: number;

    @Column()
    TimetableID: number;

    @Column()
    TrafficType: string;

    @Column()
    FlightNumber: string;

    @Column()
    Diverted: boolean;

    @Column()
    Nachtvlucht: boolean;

    @Column()
    FlightCode: number;

    @Column()
    FlightCodeDescription: string;

    @Column()
    FlightCodeIATA: string;

    @Column()
    PublicAnnouncement: boolean;

    @Column()
    ScheduledUTC: Date;

    @Column()
    ActualUTC: Date;

    @Column()
    ScheduledLocal: Date;

    @Column()
    ActualLocal: Date;

    @Column()
    Bewegingen: number;

    @Column()
    Parkeerpositie: string;

    @Column()
    Parkeercontract: string;

    @Column()
    Bus: boolean;

    @Column()
    Gate: number;

    @Column()
    Bagageband: number;

    @Column()
    AirportICAO: string;

    @Column()
    Airport: string;

    @Column()
    Country: string;

    @Column()
    ViaAirportICAO: string;

    @Column()
    ViaAirport: string;

    @Column()
    AircraftRegistration: string;

    @Column()
    Seats: number;

    @Column()
    MTOW: number;

    @Column()
    AircraftType: string;

    @Column()
    AircraftDescription: string;

    @Column()
    EU: boolean;

    @Column()
    Schengen: boolean;

    @Column()
    AirlineFullname: string;

    @Column()
    AirlineShortname: string;

    @Column()
    AirlineICAO: string;

    @Column()
    AirlineIATA: string;

    @Column()
    Debiteur: string;

    @Column()
    DebiteurNr: number;

    @Column()
    PaxMale: number;

    @Column()
    PaxFemale: number;

    @Column()
    PaxChild: number;

    @Column()
    PaxInfant: number;

    @Column()
    PaxTransitMale: number;

    @Column()
    PaxTransitFemale: number;

    @Column()
    PaxTransitChild: number;

    @Column()
    PaxTransitInfant: number;

    @Column()
    CrewCabin: number;

    @Column()
    CrewCockpit: number;

    @Column()
    BagsWeight: number;

    @Column()
    BagsTransitWeight: number;

    @Column()
    BagsTransit: number;

    @Column()
    Bags: number;

    @Column()
    Afhandelaar: string;

    @Column()
    ForecastPercentage: number;

    @Column()
    ForecastPax: number;

    @Column()
    ForecastBabys: number;

    @Column()
    FlightClass: string;

    @Column()
    Datasource: string;

    @Column()
    TotaalPax: number;

    @Column()
    TerminalPax: number;

    @Column()
    TotaalPaxBetalend: number;

    @Column()
    TerminalPaxBetalend: number;

    @Column()
    TransitPax: number;

    @Column()
    TransitPaxBetalend: number;

    @Column()
    TotaalCrew: number;

    @Column()
    TerminalCrew: number;

    @Column()
    TotaalSeats: number;

    @Column()
    TerminalSeats: number;

    @Column()
    TotaalBags: number;

    @Column()
    TerminalBags: number;

    @Column()
    TransitBags: number;

    @Column()
    TotaalBagsWeight: number;

    @Column()
    TerminalBagsWeight: number;

    @Column()
    TransitBagsWeight: number;

    @Column()
    Runway: string;

    @Column()
    Longitude: number;

    @Column()
    Elevation: number;

    @Column()
    Latitude: number;

    @Column()
    DistanceKilometers: number;

    @Column()
    Direction: string;

    @Column()
    AirportIATA: string;

    @Column()
    Forecast: string;

    @Column()
    Parked: number;

    @Column()
    Seizoen: string;

    @Column()
    Feestdag: string;
}
