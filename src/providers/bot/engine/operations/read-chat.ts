import * as dayjs from 'dayjs';
import { locales } from '../../../../config/bot/locales';
import { POST_REQUESTS } from '../../../../config/api/routes';
import patterns from '../../../../config/bot/patterns';
import exceptions from '../../../../config/bot/exceptions';
import { ParserService } from "../../../parser/parser.service";
import { OpenaiService } from "../../../openai/openai.service";
import { HttpService } from "@nestjs/axios";


export default class ReadChat {
    private tgPrefix: string;

    constructor(
        protected readonly parserService: ParserService,
        protected readonly openaiService: OpenaiService,
        protected readonly httpService: HttpService,
        private readonly bot
    ) {
        this.tgPrefix = 'https://t.me/';
    }

    async handle(message) {
        try {
            const text = message.text.toString().toLowerCase();
            if (this.isValidMessage(text)) {
                this.handleMessage(text, message);
            }
        } catch (exception) {
            console.error(exception.message);
            console.error('Context: ', message);
        }
    }

    handleMessage(message, meta) {
        console.debug(meta);
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
                        preparedData.userId = meta.from.id; // @todo: Save all the details in chats table
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

    isValidMessage(text) {
        return this.hasPattern(text) && !this.hasException(text);
    }

    hasPattern(text) {
        return patterns.some(pattern => text.includes(pattern));
    }

    hasException(text) {
        return exceptions.some(exception => text.includes(exception));
    }

    pushData(data): Promise<any> {
        return this.httpService.axiosRef.post(POST_REQUESTS, data);
    }
}