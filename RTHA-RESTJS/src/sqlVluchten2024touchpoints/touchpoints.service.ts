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

    async findByAirlineCountryTouchpoint(airline: string, country: string, touchpoint: string): Promise<TouchpointEntity> {
        const result = await this.touchpointRepository.createQueryBuilder('t')
            .where('t.AirlineShortname = :airline', { airline })
            .andWhere('t.Country = :country', { country })
            .andWhere('t.Touchpoint = :touchpoint', { touchpoint })
            .getMany();



        if (!result) {
            throw new Error(`No touchpoint found for ${airline}, ${country}, ${touchpoint}`);
        }

        return result[0];

    }
}
