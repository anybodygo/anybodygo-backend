import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { BotService } from './providers/bot/bot.service';
import { OpenaiService } from './providers/openai/openai.service';
import { HttpModule } from '@nestjs/axios';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import entities from './config/typeorm/entities';
import { ParserService } from './providers/parser/parser.service';
import { RequestsModule } from './requests/requests.module';
import { RequestDirectionsModule } from './request-directions/request-directions.module';
import {LocationService} from "./providers/location/location.service";
import { CitiesModule } from './cities/cities.module';
import { CountriesModule } from './countries/countries.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: entities,
      synchronize: true,
    }),
    RequestsModule,
    HttpModule,
    RequestDirectionsModule,
    CitiesModule,
    CountriesModule
  ],
  controllers: [AppController],
  providers: [BotService, OpenaiService, ParserService, LocationService],
})
export class AppModule {
  constructor(private dataSource: DataSource) {}
}

