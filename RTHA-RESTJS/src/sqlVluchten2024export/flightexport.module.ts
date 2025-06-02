import { Module } from '@nestjs/common';
import { FlightExportController } from './flightexport.controller';
import { FlightExportService } from './flightexport.service';
import { TouchpointModule } from 'src/sqlVluchten2024touchpoints/touchpoints.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FlightExportEntity } from './entities/flightexport.entity';
<<<<<<< HEAD
import { LoggingModule } from 'src/logging/logging.module';
import { LoggingService } from 'src/logging/logging.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([FlightExportEntity]),
        TouchpointModule,
        LoggingModule,
    ],
=======
@Module({
    imports: [TypeOrmModule.forFeature([FlightExportEntity])],
>>>>>>> main
    controllers: [FlightExportController],
    providers: [FlightExportService],
})
export class FlightExportModule { }
