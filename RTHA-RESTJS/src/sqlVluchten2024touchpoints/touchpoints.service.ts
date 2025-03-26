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

    async findByAirlineCountryTouchpoint(airline: string, country: string, touchpoint: string): Promise<TouchpointEntity[]> {
        var result;
        try {
            result = await this.touchpointRepository.createQueryBuilder('t')
                .where('t.AirlineShortname = :airline', { airline })
                .andWhere('t.Country = :country', { country })
                .andWhere('t.Touchpoint = :touchpoint', { touchpoint })
                .getMany();
        }

        catch (error) {
            if (error.name === 'ConnectionError' || error.code === 'ETIMEOUT') {
                throw new error('The database is unreachable. Please contact database administrators.\nFull error:\n', error);
            }
            else throw error;
        }

        if (!result) {
            throw new Error(`No data found for ${airline}, ${country}, ${touchpoint}`);
        }

        return result;

    }
}
