import {locales} from "../../../config/bot/locales";
import {GET_REQUESTS} from "../../../config/api/routes";
import {ParserService} from "../../parser/parser.service";
import {OpenaiService} from "../../openai/openai.service";
import {HttpService} from "@nestjs/axios";
import CreateMessage from "./operations/create-message";

const START_COMMAND: string = '/start';

import {getChat, getActionDetails} from "./operations/chat-extend";
import {AppDataSource} from "../../../app-data-source";
import {Chat} from "../../../chats/entities/chat.entity";
import {City} from "../../../cities/entities/city.entity";
import {Country} from "../../../countries/entities/country.entity";
import {Request} from "../../../requests/entities/request.entity";
import {RequestDirection} from "../../../request-directions/entities/request-direction.entity";
import {Repository} from "typeorm";


export default class MessageHandler {

    private messageCreator: CreateMessage;
    private chatsRepository: Repository<Chat>;
    private citiesRepository: Repository<City>;
    private countriesRepository: Repository<Country>;
    private requestsRepository: Repository<Request>;
    private requestDirectionsRepository: Repository<RequestDirection>;

    constructor(
        protected readonly parserService: ParserService,
        protected readonly openaiService: OpenaiService,
        protected readonly httpService: HttpService,
        private readonly bot
    ) {
        this.messageCreator = new CreateMessage();
        this.chatsRepository = AppDataSource.getRepository(Chat);
        this.citiesRepository = AppDataSource.getRepository(City);
        this.countriesRepository = AppDataSource.getRepository(Country);
        this.requestsRepository = AppDataSource.getRepository(Request);
        this.requestDirectionsRepository = AppDataSource.getRepository(RequestDirection);
    }

    async handle(message) {
        try {
            const text = message.text.toString();
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
                    await this.bot.sendMessage(
                        chatId,
                        locales.ru.notFoundRequests,
                        options
                    );
                }
            } else {
                const chat: any = await getChat(this, chatId);
                if (chat && chat.action) {
                    const actionDetails: any = await getActionDetails(this, chat, text);
                    if (actionDetails === undefined) {
                        // ignore...
                    } else if (actionDetails && actionDetails.exception) {
                        await this.bot.sendMessage(chatId, actionDetails.message);
                    } else {
                        if (['to', 'from'].includes(actionDetails.column)) {
                            const locationContext: string = actionDetails.value.country ?
                                `country:${actionDetails.value.country.id}` :
                                `city:${actionDetails.value.city.id}`;
                            const options: any = {
                                reply_markup: {
                                    inline_keyboard: [
                                        [
                                            {
                                                text: locales.ru.yes,
                                                callback_data: `edit-${actionDetails.column}:yes ${actionDetails.guid}:${locationContext}`
                                            },
                                            {
                                                text: locales.ru.no,
                                                callback_data: `edit-${actionDetails.column}:no ${actionDetails.guid}:${locationContext}`
                                            }
                                        ]
                                    ]
                                }
                            }
                            let value: string = actionDetails.value.country ?
                                actionDetails.value.country.name :
                                `${actionDetails.value.city.country.name}, ${actionDetails.value.city.name}`
                            await this.bot.sendMessage(
                                chatId,
                                locales.ru.confirmEdit.replace('{value}', value),
                                options
                            );
                        } else {
                            const request: any = await this.requestsRepository.findOneBy({ guid: actionDetails.guid });
                            console.debug(request);
                        }
                    }
                }
            }
        } catch (exception) {
            console.error(exception.message);
            console.error('Context: ', message);
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