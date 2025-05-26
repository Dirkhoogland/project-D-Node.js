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

    //Here we find the data in the database with the given query parameters (known here as 'filters')
    async findWithFilters(
        filters: Partial<FlightExportEntity>,
        limit = 50,
        offset = 0,
    ): Promise<{ data: FlightExportEntity[]; total: number }> {
        const query = this.flightExportRepository.createQueryBuilder('f');

        //After we create a query that basically calls for everything in the database
        //We start to modify this query by looking at the filters that were given at the parameters
        Object.entries(filters).forEach(([key, value]) => {
            if (value !== undefined && value !== null && value !== '') {
                query.andWhere(`f.${key} = :${key}`, { [key]: value });
            }
        });


        //After setting up the query, we execute it and order it by id (ascending) and implement pagination
        //We then return the data and the total (the count of data)
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


    //Here we simply search the database for the first row that has a identical FlightID
    async findOneById(FlightID: number): Promise<FlightExportEntity | null> {
        return await this.flightExportRepository.findOne({ where: { FlightID } });
    }
}
