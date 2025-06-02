import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TouchpointEntity } from './sqlVluchten2024touchpoints/entities/touchpoints.entity';
import { FlightExportEntity } from './sqlVluchten2024export/entities/flightexport.entity';
import { TouchpointModule } from './sqlVluchten2024touchpoints/touchpoints.module';
import { FlightExportModule } from './sqlVluchten2024export/flightexport.module';
import { AppService } from './app.service';
import { PasswordService } from './Passwords/pass';
import { AuthModule } from './auth/auth.module';
import { UserLogEntity } from './logging/entities/userlog.entity';
import { LoggingModule } from './logging/logging.module';


import { join } from 'path';

PasswordService.init([TouchpointEntity, FlightExportEntity]);
@Module({
  imports: [
    TypeOrmModule.forRoot(PasswordService.getConfig()),
    TouchpointModule,
    FlightExportModule,
    AuthModule,
    LoggingModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
