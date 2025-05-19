import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TouchpointEntity } from './sqlVluchten2024touchpoints/entities/touchpoints.entity';
import { FlightExportEntity } from './sqlVluchten2024export/entities/flightexport.entity';
import { PasswordUsername } from './auth/password.entity';
import { TouchpointModule } from './sqlVluchten2024touchpoints/touchpoints.module';
import { FlightExportModule } from './sqlVluchten2024export/flightexport.module';
import { AppService } from './app.service';
import { PasswordService } from './Passwords/pass';
import { AuthModule } from './auth/auth.module';
import { UserLogEntity } from './sqlVluchten2024touchpoints/entities/userlog.entity';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';


PasswordService.init([TouchpointEntity, FlightExportEntity, UserLogEntity, PasswordUsername]);
@Module({
  imports: [
    TypeOrmModule.forRoot({
      ...PasswordService.getConfig(),
      synchronize: false,
    }),
    TouchpointModule,
    FlightExportModule,
    AuthModule,
    ServeStaticModule.forRoot({
      rootPath: join('src/app.module.ts', '..', 'userstatspage'),
      serveRoot: '/userstats',
    })
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
