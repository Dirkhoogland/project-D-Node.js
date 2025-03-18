import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('Vluchten2024export')
export class FlightExportEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    Type: string;

    @Column()
    FlightID: string;

    @Column()
    TimetableID: string;

    @Column()
    TrafficType: string;

    @Column()
    FlightNumber: string;

    @Column()
    Diverted: string;

    @Column()
    Nachtvlucht: string;

    @Column()
    FlightCode: string;

    @Column()
    FlightCodeDescription: string;

    @Column()
    FlightCodeIATA: string;

    @Column()
    PublicAnnouncement: string;

    @Column()
    ScheduledUTC: string;

    @Column()
    ActualUTC: string;

    @Column()
    ScheduledLocal: string;

    @Column()
    ActualLocal: string;

    @Column()
    Bewegingen: string;

    @Column()
    Parkeerpositie: string;

    @Column()
    Parkeercontract: string;

    @Column()
    Bus: string;

    @Column()
    Gate: string;

    @Column()
    Bagageband: string;

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
    Seats: string;

    @Column()
    MTOW: string;

    @Column()
    AircraftType: string;

    @Column()
    AircraftDescription: string;

    @Column()
    EU: string;

    @Column()
    Schengen: string;

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
    DebiteurNr: string;

    @Column()
    PaxMale: string;

    @Column()
    PaxFemale: string;

    @Column()
    PaxChild: string;

    @Column()
    PaxInfant: string;

    @Column()
    PaxTransitMale: string;

    @Column()
    PaxTransitFemale: string;

    @Column()
    PaxTransitChild: string;

    @Column()
    PaxTransitInfant: string;

    @Column()
    CrewCabin: string;

    @Column()
    CrewCockpit: string;

    @Column()
    BagsWeight: string;

    @Column()
    BagsTransitWeight: string;

    @Column()
    Bags: string;

    @Column()
    BagsTransit: string;

    @Column()
    Afhandelaar: string;

    @Column()
    ForecastPercentage: string;

    @Column()
    ForecastPax: string;

    @Column()
    ForecastBabys: string;

    @Column()
    FlightClass: string;

    @Column()
    Datasource: string;

    @Column()
    TotaalPax: string;

    @Column()
    TerminalPax: string;

    @Column()
    TotaalPaxBetalend: string;

    @Column()
    TerminalPaxBetalend: string;

    @Column()
    TransitPax: string;

    @Column()
    TransitPaxBetalend: string;

    @Column()
    TotaalCrew: string;

    @Column()
    TerminalCrew: string;

    @Column()
    TotaalSeats: string;

    @Column()
    TerminalSeats: string;

    @Column()
    TotaalBags: string;

    @Column()
    TerminalBags: string;

    @Column()
    TransitBags: string;

    @Column()
    TotaalBagsWeight: string;

    @Column()
    TerminalBagsWeight: string;

    @Column()
    TransitBagsWeight: string;

    @Column()
    Runway: string;

    @Column()
    Longitude: string;

    @Column()
    Elevation: string;

    @Column()
    Latitude: string;

    @Column()
    DistanceKilometers: string;

    @Column()
    Direction: string;

    @Column()
    AirportIATA: string;

    @Column()
    Forecast: string;

    @Column()
    Parked: string;

    @Column()
    Seizoen: string;

    @Column()
    Feestdag: string;
}
