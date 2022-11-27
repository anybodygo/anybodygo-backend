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
    HttpModule
  ],
  controllers: [AppController],
  providers: [BotService, OpenaiService, ParserService],
})
export class AppModule {
  constructor(private dataSource: DataSource) {}
}

