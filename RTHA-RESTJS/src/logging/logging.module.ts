import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserLogEntity } from './entities/userlog.entity';
import { LoggingService } from './logging.service';
import { LoggingController } from './logging.controller';

@Module({
    imports: [TypeOrmModule.forFeature([UserLogEntity])],
    providers: [LoggingService],
    controllers: [LoggingController],
    exports: [LoggingService, TypeOrmModule],
})
export class LoggingModule { }
