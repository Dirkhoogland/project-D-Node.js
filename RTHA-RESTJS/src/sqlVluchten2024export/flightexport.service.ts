import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
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
        if (limit < 0 || offset < 0) {
            throw new BadRequestException('Limit and offset must be non-negative');
        }

        const query = this.flightExportRepository.createQueryBuilder('f');

        Object.entries(filters).forEach(([key, value]) => {
            if (value !== undefined && value !== null && value !== '') {
                if (key === 'DateTime') {
                    if (/^\d{4}-\d{2}-\d{2}$/.test(value as string)) {
                        // Use a range for the whole day
                        const start = `${value} 00:00:00`;
                        const end = `${value} 23:59:59.999`;
                        query.andWhere(`t.DateTime BETWEEN :start AND :end`, { start, end });
                    } else {
                        query.andWhere(`t.DateTime = :dateTime`, { dateTime: value });
                    }
                }
            }
        });
        const [data, total] = await query
            .orderBy('f.id', 'ASC')
            .skip(offset)
            .take(limit)
            .getManyAndCount();

        return { data, total };
    }

    async getAllFlightIDs(limit = 50, offset = 0): Promise<{ flightIDs: number[]; total: number }> {
        const query = this.flightExportRepository
            .createQueryBuilder('f')
            .select('f.FlightID')
            .distinct(true)
            .orderBy('f.FlightID', 'ASC')
            .skip(offset)
            .take(limit);

        const [results, total] = await Promise.all([
            query.getRawMany(),
            this.flightExportRepository
                .createQueryBuilder('f')
                .select('COUNT(DISTINCT f.FlightID)', 'count')
                .getRawOne()
                .then(res => Number(res.count)),
        ]);

        const flightIDs = results.map((row) => {
            const flightId = row.f_FlightID ?? row.t_FlightID;
            if (flightId === undefined) {
                throw new Error('Missing FlightID in DB result');
            }
            return flightId;
        });

        return { flightIDs, total };
    }

    async findOneById(FlightID: number): Promise<FlightExportEntity> {
        const result = await this.flightExportRepository.findOne({ where: { FlightID } });
        if (!result) {
            throw new NotFoundException('Flight not found');
        }
        return result;
    }

}


