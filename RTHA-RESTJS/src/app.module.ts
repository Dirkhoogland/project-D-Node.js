import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TouchpointEntity } from './sqlVluchten2024touchpoints/entities/touchpoints.entity';
import { FlightExportEntity } from './sqlVluchten2024export/entities/flightexport.entity';
import { PasswordUsername} from './auth/password.entity';
import { TouchpointModule } from './sqlVluchten2024touchpoints/touchpoints.module';
import { FlightExportModule } from './sqlVluchten2024export/flightexport.module';
import { AppService } from './app.service';
import { PasswordService } from './Passwords/pass';
import { AuthModule } from './auth/auth.module';

PasswordService.init([TouchpointEntity, FlightExportEntity, PasswordUsername]);
@Module({
  imports: [
    TypeOrmModule.forRoot({
      ...PasswordService.getConfig(),
      synchronize: false,
    }),
    TouchpointModule,
    FlightExportModule,
    AuthModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
