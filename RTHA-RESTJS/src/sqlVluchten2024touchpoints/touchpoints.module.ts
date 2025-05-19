import { Module } from '@nestjs/common';
import { TouchpointController } from './touchpoints.controller';
import { TouchpointService } from './touchpoints.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TouchpointEntity } from './entities/touchpoints.entity';
@Module({
    imports: [TypeOrmModule.forFeature([TouchpointEntity])],
    controllers: [TouchpointController],
    providers: [TouchpointService],
})
export class TouchpointModule { }
