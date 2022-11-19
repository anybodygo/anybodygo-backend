import { Injectable, OnModuleInit } from '@nestjs/common';
import { OpenaiService } from "../openai/openai.service";
const TelegramBot = require('node-telegram-bot-api');

@Injectable()
export class BotService implements OnModuleInit {
  constructor(private openaiService: OpenaiService) {}

  onModuleInit() {
    this.botMessage();
  }

  botMessage() {
    process.env.NTBA_FIX_319 = '1';

    const { TOKEN } = process.env;

    const bot = new TelegramBot(TOKEN, { polling: true });

    bot.on('message', (message) => {
      this.openaiService.handleMessage(message.text.toString()).then((data) => {
        if (data.choices.length) {
          const answer = `Hello, ${message.from.first_name}!\n${data.choices[0].text}`
          bot.sendMessage(
            message.chat.id,
            answer
          );
        }
        console.log(data);
      }).catch((error) => {
        console.debug(error);
      });
    });
  }
}