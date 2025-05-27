import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TouchpointEntity } from './entities/touchpoints.entity';
import { UserLogEntity } from './entities/userlog.entity';

@Injectable()
export class TouchpointService {
    constructor(
        @InjectRepository(TouchpointEntity)
        private touchpointRepository: Repository<TouchpointEntity>,
        @InjectRepository(UserLogEntity)
        private userLogRepository: Repository<UserLogEntity>,
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
            if (value !== undefined && value !== null && value !== '') {
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

    async logUser(username: string, database: string, query: string, requestUrl: string, resultFound = false): Promise<void> {
        if (username === null || username === undefined) {
            console.log('Username can not be null or undefined.');
            return;
        }
        const logEntry = this.userLogRepository.create({
            username,
            database,
            query,
            requestUrl,
            resultFound,
        });
        await this.userLogRepository.save(logEntry);
        console.log(`Logged user: ${username} on database: ${database}`);
    }
}
