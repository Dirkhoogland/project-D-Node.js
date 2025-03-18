import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('Vluchten2024touchpoints')
export class TouchpointEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    FlightID: string;

    @Column()
    TimetableID: string;

    @Column()
    FlightNumber: string;

    @Column()
    TrafficType: string;

    @Column()
    ScheduledLocal: string;

    @Column()
    AirlineShortname: string;

    @Column()
    AircraftType: string;

    @Column()
    Airport: string;

    @Column()
    Country: string;

    @Column()
    PaxForecast: string;

    @Column()
    Touchpoint: string;

    @Column()
    TouchpointTime: string;

    @Column()
    TouchpointPax: string;

    @Column({ nullable: true })
    ActualLocal: string;

    @Column({ nullable: true })
    PaxActual: string;
}
