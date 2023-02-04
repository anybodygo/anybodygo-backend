import {locales} from "../../../config/bot/locales";
import {GET_REQUESTS} from "../../../config/api/routes";
import {ParserService} from "../../parser/parser.service";
import {OpenaiService} from "../../openai/openai.service";
import {HttpService} from "@nestjs/axios";
import CreateMessage from "./operations/create-message";

const START_COMMAND: string = '/start';

import {getChat} from "./operations/chat-extend";
import {AppDataSource} from "../../../app-data-source";
import {Chat} from "../../../chats/entities/chat.entity";
import {Repository} from "typeorm";


export default class MessageHandler {

    private messageCreator: CreateMessage;
    private chatsRepository: Repository<Chat>;

    constructor(
        protected readonly parserService: ParserService,
        protected readonly openaiService: OpenaiService,
        protected readonly httpService: HttpService,
        private readonly bot
    ) {
        this.messageCreator = new CreateMessage();
        this.chatsRepository = AppDataSource.getRepository(Chat);
    }

    async handle(message) {
        try {
            const text = message.text.toString().toLowerCase();
            const userId = message.from.id;
            const chatId = message.from.id;
            if (text === START_COMMAND) {
                localStorage.clear();
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
                    await this.bot.sendMessage(
                        chatId,
                        locales.ru.notFoundRequests,
                        options
                    );
                }
            } else {
                const chat: any = await getChat(this, chatId);
                if (chat) {
                    console.debug(chat.action, '>>', text);
                }
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