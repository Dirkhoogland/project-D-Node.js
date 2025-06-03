import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TouchpointEntity } from './entities/touchpoints.entity';

@Injectable()
export class TouchpointService {
    constructor(
        @InjectRepository(TouchpointEntity)
        private touchpointRepository: Repository<TouchpointEntity>,
    ) { }

    async findWithFilters(
        filters: Partial<TouchpointEntity>,
        limit = 50,
        offset = 0,
    ): Promise<{ data: TouchpointEntity[]; total: number }> {
        if (limit < 0 || offset < 0) {
            throw new BadRequestException('Limit and offset must be non-negative');
        }

        const query = this.touchpointRepository.createQueryBuilder('t');

        Object.entries(filters).forEach(([key, value]) => {
            if (value instanceof Date) {
                const isoString = value.toISOString();

                if (isoString.endsWith('T00:00:00.000Z')) {
                    const start = new Date(isoString);
                    const end = new Date(start.getTime() + 24 * 60 * 60 * 1000 - 1);
                    query.andWhere(`t.${key} BETWEEN :start AND :end`, { start, end });
                } else {
                    query.andWhere(`t.${key} = :${key}`, { [key]: value });
                }
            } else {
                query.andWhere(`t.${key} = :${key}`, { [key]: value });
            }
        });

        const [data, total] = await query
            .orderBy('t.id', 'ASC')
            .skip(offset)
            .take(limit)
            .getManyAndCount();

        return { data, total };
    }

    async getAllFlightIDs(limit = 50, offset = 0): Promise<{ flightIDs: number[]; total: number }> {
        const query = this.touchpointRepository
            .createQueryBuilder('t')
            .select('t.FlightID')
            .distinct(true)
            .orderBy('t.FlightID', 'ASC')
            .skip(offset)
            .take(limit);

        const [results, total] = await Promise.all([
            query.getRawMany(),
            this.touchpointRepository
                .createQueryBuilder('t')
                .select('COUNT(DISTINCT t.FlightID)', 'count')
                .getRawOne()
                .then((res) => Number(res.count)),
        ]);

        const flightIDs = results.map((row) => {
            if (row.t_FlightID === undefined) {
                throw new Error('Missing FlightID in DB result');
            }
            return row.t_FlightID;
        });

        return { flightIDs, total };
    }

    async findOneById(FlightID: number): Promise<TouchpointEntity> {
        const result = await this.touchpointRepository.findOne({ where: { FlightID } });
        if (!result) {
            throw new NotFoundException('Touchpoint not found');
        }
        return result;
    }

}
