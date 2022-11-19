import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { BotService } from './bot/bot.service';
import { OpenaiService } from "./openai/openai.service";

@Module({
  imports: [],
  controllers: [AppController],
  providers: [BotService, OpenaiService],
})
export class AppModule {}
