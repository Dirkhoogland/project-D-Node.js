import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FlightExportEntity } from './entities/flightexport.entity';

@Injectable()
export class FlightExportService {
    constructor(
        @InjectRepository(FlightExportEntity)
        private flightExportRepository: Repository<FlightExportEntity>,
    ) { }

    async findWithFilters(
        filters: Partial<FlightExportEntity>,
        limit = 50,
        offset = 0,
    ): Promise<{ data: FlightExportEntity[]; total: number }> {
        const query = this.flightExportRepository.createQueryBuilder('f');

        Object.entries(filters).forEach(([key, value]) => {
            if (value !== undefined && value !== null && value !== '') {
                query.andWhere(`f.${key} = :${key}`, { [key]: value });
            }
        });

        const [data, total] = await query
            .orderBy('f.id', 'ASC') // voor stabiele paginering
            .skip(offset)
            .take(limit)
            .getManyAndCount();

        return { data, total };
    }

    async findOneById(FlightID: number): Promise<FlightExportEntity | null> {
        return await this.flightExportRepository.findOne({ where: { FlightID } });
    }
}
