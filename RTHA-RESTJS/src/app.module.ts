import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TouchpointEntity } from './sqlVluchten2024touchpoints/entities/touchpoints.entity';
import { FlightExportEntity } from './sqlVluchten2024export/entities/flightexport.entity';
import { TouchpointModule } from './sqlVluchten2024touchpoints/touchpoints.module';
import { FlightExportModule } from './sqlVluchten2024export/flightexport.module';
import { AppService } from './app.service';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mssql',
      host: '77.170.251.180',
      port: 1433,
      username: 'Mex',
      password: 'Mex14',
      database: 'FlightDB',
      entities: [TouchpointEntity, FlightExportEntity], // Add all your entities here
      synchronize: false,  // Auto-create tables (disable in production)
      options: {
        encrypt: false,
        trustServerCertificate: true
      },
    }),
    TouchpointModule, FlightExportModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
