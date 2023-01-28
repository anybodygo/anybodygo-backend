import {locales} from "../../../config/bot/locales";
import {GET_REQUESTS} from "../../../config/api/routes";
import {ParserService} from "../../parser/parser.service";
import {OpenaiService} from "../../openai/openai.service";
import {HttpService} from "@nestjs/axios";
import CreateMessage from "./operations/create-message";

const START_COMMAND: string = '/start';
const BOT_CHAT_TYPE: string = 'private';


export default class MessageHandler {

    private messageCreator: CreateMessage;

    constructor(
        protected readonly parserService: ParserService,
        protected readonly openaiService: OpenaiService,
        protected readonly httpService: HttpService,
        private readonly bot
    ) {
        this.messageCreator = new CreateMessage();
    }

    async handle(message) {
        try {
            const type = message.chat.type;
            const text = message.text.toString().toLowerCase();
            if (type === BOT_CHAT_TYPE) {
                const userId = message.from.id;
                const chatId = message.from.id;
                if (text === START_COMMAND) {
                    const requests = await this.getRequests(userId);
                    if (requests.length) {
                        this.handleRequests(chatId, requests);
                    } else {
                        const options: any = {
                            reply_markup: {
                                inline_keyboard: [
                                    [{text: locales.ru.createRequest, callback_data: `create-request`}],
                                ]
                            }
                        }
                        this.bot.sendMessage(
                            chatId,
                            locales.ru.notFoundRequests,
                            options
                        );
                    }
                }
            } else {

            }
        } catch (exception) {
            console.error(exception);
        }
    }

    async getRequests(userId: number) {
        const { data } = await this.getUserRequests(userId);
        return data.data;
    }

    handleRequests(chatId: number, requests) {
        this.bot.sendMessage(
            chatId,
            locales.ru.foundRequests
        ).then(() => {
            requests.forEach((request) => {
                const message = this.messageCreator.createRequestMessage(request);
                const options: any = {
                    reply_markup: {
                        inline_keyboard: [
                            [
                                {text: locales.ru.remove, callback_data: `remove ${request.guid}`},
                                {text: locales.ru.edit, callback_data: `edit ${request.guid}`}
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
        });
    }

    getUserRequests(userId): Promise<any> {
        const query = GET_REQUESTS + `?userId=${userId}`;
        return this.httpService.axiosRef.get(query);
    }
}