import {locales} from "../../../../config/bot/locales";
import {AppDataSource} from "../../../../app-data-source"
import {Chat} from "../../../../chats/entities/chat.entity";
import {Request} from "../../../../requests/entities/request.entity";
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

import {handleAction} from "./chat-extend";

export default class EditOperation {
    private chatsRepository: Repository<Chat>;
    private requestsRepository: Repository<Request>;
    constructor(private readonly bot) {
        this.chatsRepository = AppDataSource.getRepository(Chat);
        this.requestsRepository = AppDataSource.getRepository(Request);
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
                // add save current action
                // query.session.currentAction = command;
                // handle this value
                const hasReward: boolean = command === EDIT_REWARD_YES_COMMAND;
                console.debug(hasReward);
                break;
            case EDIT_FROM_YES_COMMAND:
                output.guid = guid.substring(0, guid.indexOf(':'));
                if (guid.includes('city')) {
                    output.fromCityId = +guid.substring(guid.indexOf(':city:') + 6);
                } else {
                    output.fromCountryId = +guid.substring(guid.indexOf(':country:') + 9);
                }
                console.debug(output);
                request = await this.requestsRepository.findOneBy({ guid: output.guid });
                console.debug(request);
                break;
            case EDIT_TO_YES_COMMAND:
                output.guid = guid.substring(0, guid.indexOf(':'));
                if (guid.includes('city')) {
                    output.toCityId = +guid.substring(guid.indexOf(':city:') + 6);
                } else {
                    output.toCountryId = +guid.substring(guid.indexOf(':country:') + 9);
                }
                console.debug(output);
                request = await this.requestsRepository.findOneBy({ guid: output.guid });
                console.debug(request);
                break;
        }
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