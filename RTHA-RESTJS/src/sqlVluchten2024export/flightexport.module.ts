import { Module } from '@nestjs/common';
import { FlightExportController } from './flightexport.controller';
import { FlightExportService } from './flightexport.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FlightExportEntity } from './entities/flightexport.entity';
@Module({
    imports: [TypeOrmModule.forFeature([FlightExportEntity])],
    controllers: [FlightExportController],
    providers: [FlightExportService],
})
export class FlightExportModule { }
