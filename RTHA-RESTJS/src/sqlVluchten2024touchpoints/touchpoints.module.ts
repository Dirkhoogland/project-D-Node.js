import { Module } from '@nestjs/common';
import { TouchpointController } from './touchpoints.controller';
import { TouchpointService } from './touchpoints.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TouchpointEntity } from './entities/touchpoints.entity';
import { LoggingModule } from 'src/logging/logging.module';

@Module({
    imports: [TypeOrmModule.forFeature([TouchpointEntity]), LoggingModule],
    controllers: [TouchpointController],
    providers: [TouchpointService],
    exports: [TouchpointService],
})
export class TouchpointModule { }
