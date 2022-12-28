import { Injectable, OnModuleInit } from '@nestjs/common';
import { OpenaiService } from '../openai/openai.service';
import {GET_REQUESTS, POST_REQUESTS} from '../../config/api/routes';
import patterns from '../../config/bot/patterns';
import exceptions from '../../config/bot/exceptions';
import { HttpService } from '@nestjs/axios';
import { ParserService } from '../parser/parser.service';
import { locales } from '../../config/bot/locales';
const TelegramBot = require('node-telegram-bot-api');
import * as dayjs from 'dayjs';
require('dotenv').config();

const BOT_CHAT_TYPE: string = 'private';
const START_COMMAND: string = '/start';
const EDIT_COMMAND: string = 'edit';
const REMOVE_COMMAND: string = 'remove';
const CREATE_REQUEST_COMMAND: string = 'create-request';

@Injectable()
export class BotService implements OnModuleInit {
  private bot: any;
  private tgPrefix: string;

  constructor(
    private readonly parserService: ParserService,
    private readonly openaiService: OpenaiService,
    private readonly httpService: HttpService
  ) {
    this.bot = new TelegramBot(process.env.TOKEN, { polling: true });
    this.tgPrefix = 'https://t.me/';
  }

  onModuleInit() {
    this.botMessage();
    this.botCallback();
  }

  botCallback() {
    this.bot.on('callback_query', function onCallbackQuery(callbackQuery) {
      try {
        const context = callbackQuery.data;
        if (context === CREATE_REQUEST_COMMAND) {
          this.sendMessage(
              callbackQuery.message.chat.id,
              locales.ru.infoAboutCreation
          ).then(() => {
            this.sendMessage(
                callbackQuery.message.chat.id,
                locales.ru.infoAboutBot
            );
          });
        } else if (context.includes(REMOVE_COMMAND)) {
          // @todo: add flow
          this.sendMessage(
              callbackQuery.message.chat.id,
              locales.ru.noRemoveAvailable
          );
        } else if (context.includes(EDIT_COMMAND)) {
          // @todo: add flow
          this.sendMessage(
              callbackQuery.message.chat.id,
              locales.ru.noEditAvailable
          );
        }
      } catch (exception) {
        console.error(exception);
      }
    });
  }

  botMessage() {
    this.bot.on('message', (message) => {
      try {
        if (message.chat.type === BOT_CHAT_TYPE) {
          if (message.text.toString() === START_COMMAND) {
            this.validateUser(message.from.id, message.chat.id);
          }
        } else {
          const text = message.text.toString().toLowerCase();
          if (this.isValid(text)) {
            this.handleMessage(text, message);
          }
        }
      } catch (exception) {
        console.error(exception);
      }
    });
  }

  validateUser(userId: number, chatId: number) {
    this.getUserRequests(userId)
        .then(({data}) => {
          const requests = data.data;
          this.handleRequests(chatId, requests);
        })
  }

  handleRequests(chatId: number, requests) {
    if (!requests.length) {
      const options: any = {
        reply_markup: {
          inline_keyboard: [
            [{text: locales.ru.createRequest, callback_data: `create-request` }],
          ]
        }
      }
      this.bot.sendMessage(
          chatId,
          locales.ru.notFoundRequests,
          options
      );
    } else {
      this.bot.sendMessage(
          chatId,
          locales.ru.foundRequests
      );
      requests.forEach((request) => {
        const message = this.getRequestMessage(request);
        const options: any = {
          reply_markup: {
            inline_keyboard: [
              [
                  {text: locales.ru.remove, callback_data: `remove ${request.guid}` },
                  {text: locales.ru.edit, callback_data: `edit ${request.guid}` }
              ]
            ]
          }
        }
        this.bot.sendMessage(
            chatId,
            message,
            options
        );
      })
    }
  }

  getRequestMessage(request): string
  {
    let message = ``;
    if (request.from && request.from.length) {
      const from = request.from.join(", ");
      message += `${locales.ru.from}: ${from}\n`;
    }
    if (request.to && request.to.length) {
      const to = request.to.join(", ");
      message += `${locales.ru.to}: ${to}\n`;
    }
    if (request.dateFrom) {
      const date = dayjs(request.dateFrom).format('YYYY-MM-DD');
      message += `${locales.ru.fromDate}: ${date}\n`;
    }
    if (request.dateTo) {
      const date = dayjs(request.dateTo).format('YYYY-MM-DD');
      message += `${locales.ru.toDate}: ${date}\n`;
    }
    if (request.context) {
      message += `${locales.ru.whatBring}: ${request.context}\n`;
    }
    if (request.hasReward) {
      let reward: string = '';
      switch (request.hasReward) {
        case true:
          reward = locales.ru.hasReward;
          break;
        case false:
          reward = locales.ru.noReward;
          break;
        default:
          reward = locales.ru.unknownReward;
      }
      message += `${locales.ru.reward}: ${reward}\n`;
    }
    message += `\n`;
    if (request.messageLink) {
      message += `${locales.ru.message}:\n${request.messageLink}`;
    }
    return message;
  }

  hasPattern(text) {
    return patterns.some(pattern => text.includes(pattern));
  }

  hasException(text) {
    return exceptions.some(exception => text.includes(exception));
  }

  isValid(text) {
    return this.hasPattern(text) && !this.hasException(text);
  }

  handleMessage(message, meta) {
    console.log(meta);
    const date: string = dayjs().format('DD.MM.YYYY HH:mm');
    const prefix: string = `${meta.chat.title}\n${date}\n\n`
    this.openaiService.handleMessage(message, prefix).then((data) => {
      if (data.choices.length) {
        const text: string = data.choices[0].text;
        const parsedData: any = this.parserService.parseData(text);
        this.parserService.prepareDataToRequestObject(parsedData).then((preparedData) => {
          if (parsedData) {
            preparedData.chatId = meta.chat.id;
            preparedData.messageId = meta.message_id;
            preparedData.userId = meta.from.id; // @todo: Save all the details in users table
            preparedData.chatName = meta.chat.title;
            preparedData.chatLink = `${this.tgPrefix}${meta.chat.username}`;
            preparedData.message = meta.text;
            preparedData.messageLink = `${preparedData.chatLink}/${preparedData.messageId}`;
            this.pushData(preparedData)
                .then(({data}) => {
                  const link: string = `${process.env.FRONTEND_URL}?hash=${data.guid}`;
                  const answer: string = `${locales.ru.replyMessage}\n`; // ru locale as default
                  const options: any = {
                    reply_to_message_id: meta.message_id,
                    reply_markup: {
                      inline_keyboard: [[{
                        text: locales.ru.replyActionText,
                        switch_inline_query: locales.ru.replySwitch,
                        url: link
                      }]]
                    }
                  }
                  this.bot.sendMessage(
                      meta.chat.id,
                      answer,
                      options
                  );
                })
                .catch((error) => {
                  console.error(error); // something happened with POST request
                })
          }
        });
      }
    }).catch((error) => {
      console.error(error);
    });
  }

  pushData(data): Promise<any> {
    return this.httpService.axiosRef.post(POST_REQUESTS, data);
  }

  getUserRequests(userId): Promise<any> {
    const query = GET_REQUESTS + `?userId=${userId}`;
    return this.httpService.axiosRef.get(query);
  }
}