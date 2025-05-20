import { Module } from '@nestjs/common';
import { FlightExportController } from './flightexport.controller';
import { FlightExportService } from './flightexport.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FlightExportEntity } from './entities/flightexport.entity';
import { UserLogEntity } from 'src/sqlVluchten2024touchpoints/entities/userlog.entity';
@Module({
    imports: [TypeOrmModule.forFeature([FlightExportEntity, UserLogEntity])],
    controllers: [FlightExportController],
    providers: [FlightExportService],
})
export class FlightExportModule { }
