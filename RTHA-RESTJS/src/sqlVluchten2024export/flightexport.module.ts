import { Module } from '@nestjs/common';
import { FlightExportController } from './flightexport.controller';
import { FlightExportService } from './flightexport.service';
import { TouchpointModule } from 'src/sqlVluchten2024touchpoints/touchpoints.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FlightExportEntity } from './entities/flightexport.entity';
import { ExportLogEntity } from './entities/exportlog.entity';
@Module({
    imports: [TypeOrmModule.forFeature([FlightExportEntity, ExportLogEntity]),
        TouchpointModule],
    controllers: [FlightExportController],
    providers: [FlightExportService],
})
export class FlightExportModule { }
