import { Injectable, OnModuleInit } from '@nestjs/common';
import { OpenaiService } from '../openai/openai.service';
import { POST_REQUESTS } from '../../config/api/routes';
import patterns from '../../config/bot/patterns';
import { HttpService } from "@nestjs/axios";
const TelegramBot = require('node-telegram-bot-api');

@Injectable()
export class BotService implements OnModuleInit {
  private bot: any;

  constructor(
    private readonly openaiService: OpenaiService,
    private readonly httpService: HttpService
  ) {
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
        console.log(data);
        const options: any = {
          reply_to_message_id: meta.message_id,
        }
        this.bot.sendMessage(
          meta.chat.id,
          data.choices[0].text,
          options
        );
        /* @note: test data */
        
        // this.pushData()
        //   .then(({ data } ) => {
        //     console.log(data)
        //     const link: string = data.link;
        //     const answer = `Разместил твой запрос на AnybodyGo\n[${link}]\n\nЧтобы те, кто едут, смогли его найти`;
        //     const options: any = {
        //       reply_to_message_id: meta.message_id,
        //     }
        //     this.bot.sendMessage(
        //       meta.chat.id,
        //       answer,
        //       options
        //     );
        // })
      }
      console.log(data);
    }).catch((error) => {
      console.debug(error);
    });
  }

  pushData(): Promise<any> {
    return this.httpService.axiosRef.post(POST_REQUESTS);
  }
}