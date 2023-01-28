import { Injectable, OnModuleInit } from '@nestjs/common';
import { OpenaiService } from '../openai/openai.service';
import { HttpService } from '@nestjs/axios';
import { ParserService } from '../parser/parser.service';
const TelegramBot = require('node-telegram-bot-api');
import Handler from "./engine/handler";
require('dotenv').config();

const BOT_CHAT_TYPE: string = 'private';

@Injectable()
export class BotService extends Handler implements OnModuleInit {

  constructor(
      parserService: ParserService,
      openaiService: OpenaiService,
      httpService: HttpService
  ) {
    const bot = new TelegramBot(process.env.TOKEN, {polling: true});
    super(parserService, openaiService, httpService, bot);
  }

  onModuleInit() {
    this.botMessage();
    this.botCallback();
  }

  botCallback() {
    const _this = this;
    this.bot.on('callback_query', function onCallbackQuery(query) {
      try {
        _this.handleCallback(query);
      } catch (exception) {
        console.error(exception);
      }
    });
  }

  botMessage() {
    const _this = this;
    this.bot.on('message', (message) => {
      try {
        if (message.chat.type === BOT_CHAT_TYPE) {
          _this.handleMessage(message);
        } else {
          _this.readChat(message);
        }
      } catch (exception) {
        console.error(exception);
      }
    });
  }
}