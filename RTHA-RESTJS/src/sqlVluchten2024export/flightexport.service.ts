import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FlightExportEntity } from './entities/flightexport.entity';
import { UserLogEntity } from 'src/sqlVluchten2024touchpoints/entities/userlog.entity';

@Injectable()
export class FlightExportService {
    constructor(
        @InjectRepository(FlightExportEntity)
        private flightExportRepository: Repository<FlightExportEntity>,
        @InjectRepository(UserLogEntity)
        private userLogRepository: Repository<UserLogEntity>,
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
            query.getRawMany(), // paginated data
            this.flightExportRepository
                .createQueryBuilder('f')
                .select('COUNT(DISTINCT f.FlightID)', 'count')
                .getRawOne()
                .then(res => Number(res.count)),
        ]);

        const flightIDs = results.map((row) => row.f_FlightID);
        return { flightIDs, total };
    }


    async findOneById(FlightID: number): Promise<FlightExportEntity | null> {
        return await this.flightExportRepository.findOne({ where: { FlightID } });
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
