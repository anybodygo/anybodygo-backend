import {locales} from "../../../../config/bot/locales";
import {AppDataSource} from "../../../../app-data-source"
import {Chat} from "../../../../chats/entities/chat.entity";
import {Request} from "../../../../requests/entities/request.entity";
import {City} from "../../../../cities/entities/city.entity";
import {Country} from "../../../../countries/entities/country.entity";
import {Repository} from "typeorm";

const EDIT_COMMAND: string = 'edit';
const EDIT_FROM_COMMAND: string = 'edit-from';
const EDIT_TO_COMMAND: string = 'edit-to';
const EDIT_DATE_FROM_COMMAND: string = 'edit-date-from';
const EDIT_DATE_TO_COMMAND: string = 'edit-date-to';
const EDIT_WHAT_COMMAND: string = 'edit-what';
const EDIT_REWARD_COMMAND: string = 'edit-reward';
const EDIT_REWARD_YES_COMMAND: string = 'edit-reward:yes';
const EDIT_REWARD_NO_COMMAND: string = 'edit-reward:no';
const EDIT_FROM_YES_COMMAND: string = 'edit-from:yes';
const EDIT_FROM_NO_COMMAND: string = 'edit-from:no';
const EDIT_TO_YES_COMMAND: string = 'edit-to:yes';
const EDIT_TO_NO_COMMAND: string = 'edit-to:no';

import {getCity, getCountry, handleAction, updateChat} from "./chat-extend";
import MessageHandler from "../message-handler";
import {ParserService} from "../../../parser/parser.service";
import {OpenaiService} from "../../../openai/openai.service";
import {HttpService} from "@nestjs/axios";
import {RequestDirection} from "../../../../request-directions/entities/request-direction.entity";

export default class EditOperation {
    private chatsRepository: Repository<Chat>;
    private requestsRepository: Repository<Request>;
    private requestDirectionsRepository: Repository<RequestDirection>;
    private citiesRepository: Repository<City>;
    private countriesRepository: Repository<Country>;
    private messageHandler: MessageHandler;
    constructor(
        private readonly bot,
        parserService: ParserService,
        openaiService: OpenaiService,
        httpService: HttpService
    ) {
        this.chatsRepository = AppDataSource.getRepository(Chat);
        this.requestsRepository = AppDataSource.getRepository(Request);
        this.requestDirectionsRepository = AppDataSource.getRepository(RequestDirection);
        this.citiesRepository = AppDataSource.getRepository(City);
        this.countriesRepository = AppDataSource.getRepository(Country);
        this.messageHandler = new MessageHandler(parserService, openaiService, httpService, bot);
    }

    async handle(context, chatId) {
        const separatorIndex: number = context.indexOf(' ');
        const command = context.substring(0, separatorIndex);
        const guid: string = context.substring(separatorIndex + 1);
        let options: any = {};
        let output: any = {};
        let request: any = null;
        let prefixId = -1;
        switch (command) {
            case EDIT_COMMAND:
                options = { reply_markup: { inline_keyboard: this.getOptionsKeyboard(guid) } }
                await this.bot.sendMessage(chatId, locales.ru.editOptionsMessage, options);
                break;
            case EDIT_FROM_NO_COMMAND:
            case EDIT_FROM_COMMAND:
                prefixId = context.indexOf(':no');
                prefixId = prefixId > -1 ? prefixId : context.indexOf(' ');
                await handleAction(this, chatId, `${context.substring(0, prefixId)} ${guid}`, locales.ru.editFromMessage);
                break;
            case EDIT_TO_NO_COMMAND:
            case EDIT_TO_COMMAND:
                prefixId = context.indexOf(':no');
                prefixId = prefixId > -1 ? prefixId : context.indexOf(' ');
                await handleAction(this, chatId, `${context.substring(0, prefixId)} ${guid}`, locales.ru.editToMessage);
                break;
            case EDIT_DATE_FROM_COMMAND:
                await handleAction(this, chatId, context, locales.ru.editDateFromMessage);
                break;
            case EDIT_DATE_TO_COMMAND:
                await handleAction(this, chatId, context, locales.ru.editDateToMessage);
                break;
            case EDIT_REWARD_COMMAND:
                options = { reply_markup: { inline_keyboard: this.getRewardOptionsKeyboard(guid) } }
                await handleAction(this, chatId, context, locales.ru.editRewardMessage, options);
                break;
            case EDIT_WHAT_COMMAND:
                await handleAction(this, chatId, context, locales.ru.editWhatMessage);
                break;
            case EDIT_REWARD_YES_COMMAND:
            case EDIT_REWARD_NO_COMMAND:
                const hasReward: boolean = command === EDIT_REWARD_YES_COMMAND;
                request = await this.requestsRepository.findOneBy({ guid: output.guid });
                if (request) {
                    request.hasReward = hasReward;
                    const updatedRequest: any = await this.requestsRepository.save({ ...request });
                    if (updatedRequest) {
                        this.bot.sendMessage(
                            chatId,
                            locales.ru.updateRequestMessage
                        ).then(() => {
                            this.messageHandler.sendConfirmation(chatId, request).then(() => {
                                updateChat(this, chatId, null);
                            });
                        });
                    }
                }
                // get request
                break;
            case EDIT_FROM_YES_COMMAND:
                output.guid = guid.substring(0, guid.indexOf(':'));
                if (guid.includes('city')) {
                    output.from = await this.citiesRepository
                        .findOneBy({
                            id: +guid.substring(guid.indexOf(':city:') + 6)
                        });
                } else {
                    output.from = await this.countriesRepository
                        .findOneBy({
                            id: +guid.substring(guid.indexOf(':country:') + 9)
                        });
                }
                if (output.from) {
                    request = await this.requestsRepository.findOneBy({ guid: output.guid });
                    if (request) {
                        request.from = [output.from.name];
                        const updatedRequest: any = await this.requestsRepository.save({ ...request });
                        if (updatedRequest) {
                            await this.handleRequestWithDirections(chatId, updatedRequest);
                        }
                    }
                }
                // get request
                break;
            case EDIT_TO_YES_COMMAND:
                output.guid = guid.substring(0, guid.indexOf(':'));
                if (guid.includes('city')) {
                    output.to = await this.citiesRepository
                        .findOneBy({
                            id: +guid.substring(guid.indexOf(':city:') + 6)
                        });
                } else {
                    output.to = await this.countriesRepository
                        .findOneBy({
                            id: +guid.substring(guid.indexOf(':country:') + 9)
                        });
                }
                if (output.to) {
                    request = await this.requestsRepository.findOneBy({ guid: output.guid });
                    if (request) {
                        request.to = [output.to.name];
                        const updatedRequest: any = await this.requestsRepository.save({ ...request });
                        if (updatedRequest) {
                            await this.handleRequestWithDirections(chatId, updatedRequest);
                        }
                    }
                }
                break;
        }
    }

    private async handleRequestWithDirections(chatId, updatedRequest) {
        const directions: any = await this.parseDirections(updatedRequest.from, updatedRequest.to);
        if (directions) {
            const emptyDirectionsList: any = await this.requestDirectionsRepository
                .delete({request: updatedRequest});
            if (emptyDirectionsList && emptyDirectionsList.affected === 0) {
                directions.forEach((directionData) => {
                    const newDirectionAttributes = { ...directionData, request: updatedRequest };
                    const newDirection = this.requestDirectionsRepository.create(newDirectionAttributes);
                    return this.requestDirectionsRepository.save(newDirection);
                });
                this.bot.sendMessage(
                    chatId,
                    locales.ru.updateRequestMessage
                ).then(() => {
                    this.messageHandler.sendConfirmation(chatId, updatedRequest)
                        .then(() => {
                            updateChat(this, chatId, null);
                        });
                });
            }
        } else {
            this.bot.sendMessage(
                chatId,
                locales.ru.updateRequestMessage
            ).then(() => {
                this.messageHandler.sendConfirmation(chatId, updatedRequest)
                    .then(() => {
                        updateChat(this, chatId, null);
                    });
            });
        }
    }

    private async parseDirections(from: string[], to: string[]) {
        const fromData: any = [];
        const toData: any = [];
        for (let i = 0; i < from.length; i++) {
            const data: any = await this.getLocation('from', from[i]);
            if (data) {
                fromData.push(data);
            }
        }
        for (let i = 0; i < to.length; i++) {
            const data: any = await this.getLocation('to', to[i]);
            if (data) {
                toData.push(data);
            }
        }
        const directions: any = [];
        fromData.forEach((fromLocation) => {
            toData.forEach((toLocation) => {
                const item: any = {};
                if (fromLocation.from_country_id) {
                    item['fromCountryId'] = fromLocation.from_country_id;
                }
                if (fromLocation.from_city_id) {
                    item['fromCityId'] = fromLocation.from_city_id;
                }
                if (toLocation.to_country_id) {
                    item['toCountryId'] = toLocation.to_country_id;
                }
                if (toLocation.to_city_id) {
                    item['toCityId'] = toLocation.to_city_id;
                }
                directions.push(item);
            })
        })
        return directions;
    }

    private async getLocation(prefix: string, value: string)
    {
        const cityKey: string = `${prefix}_city_id`;
        const countryKey: string = `${prefix}_country_id`;
        const object: any = {};
        const country = await getCountry(this, value);
        if (country) {
            object[countryKey] = country.id;
        } else {
            const city = await getCity(this, value);
            if (city) {
                object[countryKey] = city.country.id;
                object[cityKey] = city.id;
            } else {
                console.error(`There are no cities and countries with name: ${value}`);
            }
        }
        return Object.keys(object).length ? object : null;
    }

    private getRewardOptionsKeyboard(guid) {
        return [
            [
                {
                    text: locales.ru.yes,
                    callback_data: `${EDIT_REWARD_YES_COMMAND} ${guid}`
                },
                {
                    text: locales.ru.no,
                    callback_data: `${EDIT_REWARD_NO_COMMAND} ${guid}`
                }
            ]
        ]
    }

    private getOptionsKeyboard(guid) {
        return [
            [
                {
                    text: locales.ru.editOptionFrom,
                    callback_data: `${EDIT_FROM_COMMAND} ${guid}`
                },
                {
                    text: locales.ru.editOptionTo,
                    callback_data: `${EDIT_TO_COMMAND} ${guid}`
                }
            ],
            [
                {
                    text: locales.ru.editOptionDateFrom,
                    callback_data: `${EDIT_DATE_FROM_COMMAND} ${guid}`
                },
                {
                    text: locales.ru.editOptionDateTo,
                    callback_data: `${EDIT_DATE_TO_COMMAND} ${guid}`
                }
            ],
            [
                {
                    text: locales.ru.editOptionWhat,
                    callback_data: `${EDIT_WHAT_COMMAND} ${guid}`
                }
            ],
            [
                {
                    text: locales.ru.editOptionReward,
                    callback_data: `${EDIT_REWARD_COMMAND} ${guid}`
                }
            ]
        ]
    }

}