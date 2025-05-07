import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { Exclude } from 'class-transformer';

@Entity('Vluchten2024touchpoints')
export class TouchpointEntity {
    @Exclude()
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    FlightID: number;

    @Column()
    TimetableID: number;

    @Column()
    FlightNumber: string;

    @Column()
    TrafficType: string;

    @Column()
    ScheduledLocal: Date;

    @Column()
    AirlineShortname: string;

    @Column()
    AircraftType: string;

    @Column()
    Airport: string;

    @Column()
    Country: string;

    @Column()
    PaxForecast: number;

    @Column()
    Touchpoint: string;

    @Column()
    TouchpointTime: Date;

    @Column()
    TouchpointPax: number;

    @Column({ nullable: true })
    ActualLocal: Date;

    @Column({ nullable: true })
    PaxActual: number;
}
