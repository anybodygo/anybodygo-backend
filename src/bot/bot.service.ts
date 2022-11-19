import { Injectable, OnModuleInit } from '@nestjs/common';
import { OpenaiService } from '../openai/openai.service';
import patterns from '../resources/patterns';
const TelegramBot = require('node-telegram-bot-api');

@Injectable()
export class BotService implements OnModuleInit {
  private bot: any;

  constructor(private openaiService: OpenaiService) {
    this.bot = new TelegramBot(process.env.TOKEN, { polling: true });
  }

  onModuleInit() {
    this.botMessage();
  }

  botMessage() {
    this.bot.on('message', (message) => {
      const text = message.text.toString().toLowerCase();
      if (this.hasPattern(text)) {
        this.handleMessage(text, message);
      }
    });
  }

  hasPattern(text) {
    return patterns.some(pattern => text.includes(pattern));
  }

  handleMessage(message, meta) {
    this.openaiService.handleMessage(message).then((data) => {
      if (data.choices.length) {
        const answer = `Привет, ${meta.from.first_name}!\nТвоё сообщение подходит под нашу обработку!\n\nНаш ответ:\n${data.choices[0].text}`
        const options: any = {
          reply_to_message_id: meta.message_id,
        }
        this.bot.sendMessage(
          meta.chat.id,
          answer,
          options
        );
      }
      console.log(data);
    }).catch((error) => {
      console.debug(error);
    });
  }
}