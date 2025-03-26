import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FlightExportEntity } from './entities/flightexport.entity';

@Injectable()
export class FlightExportService {
    constructor(
        @InjectRepository(FlightExportEntity)
        private touchpointRepository: Repository<FlightExportEntity>,
    ) { }

    async findByRegistration(registration: string): Promise<FlightExportEntity[]> {
        const results = await this.touchpointRepository.createQueryBuilder('t')
            .where('t.AircraftRegistration = :registration', { registration })
            .getMany();

        if (!results) {
            throw new Error(`No flight found for ${registration}.`);
        }

        return results;

    }
}
