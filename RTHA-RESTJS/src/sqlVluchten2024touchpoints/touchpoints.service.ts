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

    async findWithFilters(filters: Partial<TouchpointEntity>): Promise<TouchpointEntity[]> {
        const query = this.touchpointRepository.createQueryBuilder('t');

        // Dynamisch filters toevoegen
        Object.entries(filters).forEach(([key, value]) => {
            if (value !== undefined && value !== null && value !== '') {
                query.andWhere(`t.${key} = :${key}`, { [key]: value });
            }
        });

        // Limiteer om performance te beschermen
        return await query.limit(10).getMany();
    }
}
