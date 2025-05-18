import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TouchpointEntity } from './entities/touchpoints.entity';

@Injectable()
export class TouchpointService {
    constructor(
        @InjectRepository(TouchpointEntity)
        private touchpointRepository: Repository<TouchpointEntity>,
    ) { }

    //Here we find the data in the database with the given query parameters (known here as 'filters')
    async findWithFilters(
        filters: Partial<TouchpointEntity>,
        limit = 50,
        offset = 0,
    ): Promise<{ data: TouchpointEntity[]; total: number }> {
        const query = this.touchpointRepository.createQueryBuilder('t');

        //After we create a query that basically calls for everything in the database
        //We start to modify this query by looking at the filters that were given at the parameters
        Object.entries(filters).forEach(([key, value]) => {
            if (value !== undefined && value !== null && value !== '') {
                query.andWhere(`t.${key} = :${key}`, { [key]: value });
            }
        });

        //After setting up the query, we execute it and order it by id (ascending) and implement pagination
        //We then return the data and the total (the count of data)
        const [data, total] = await query
            .orderBy('t.id', 'ASC')
            .skip(offset)
            .take(limit)
            .getManyAndCount();

        return { data, total };
    }

    //Here we simply search the database for the first row that has a identical FlightID
    async findOneById(FlightID: number): Promise<TouchpointEntity | null> {
        return await this.touchpointRepository.findOne({ where: { FlightID } });
    }
}
