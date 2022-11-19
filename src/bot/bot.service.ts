import { Injectable, OnModuleInit } from '@nestjs/common';
const TelegramBot = require('node-telegram-bot-api');
require('dotenv').config();

@Injectable()
export class BotService implements OnModuleInit {
  onModuleInit() {
    this.botMessage();
  }

  botMessage() {
    process.env.NTBA_FIX_319 = '1';

    const { TOKEN } = process.env;

    const bot = new TelegramBot(TOKEN, { polling: true });

    bot.on('message', (msg) => {
      console.log(msg);
      const Hi = 'hi';
      if (msg.text.toString().toLowerCase().indexOf(Hi) === 0) {
        bot.sendMessage(
          msg.from.id,
          'Hello ' +
            msg.from.first_name +
            ' what would you like to know about me ?',
        );
      }
    });
  }
}