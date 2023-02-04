import {locales} from "../../../../config/bot/locales";
import {AppDataSource} from "../../../../app-data-source"
import {Chat} from "../../../../chats/entities/chat.entity";
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

import {handleAction} from "./chat-extend";

export default class EditOperation {
    private chatsRepository: Repository<Chat>;
    constructor(private readonly bot) {
        this.chatsRepository = AppDataSource.getRepository(Chat);
    }

    async handle(context, chatId) {
        const separatorIndex: number = context.indexOf(' ');
        const command = context.substring(0, separatorIndex);
        const guid: string = context.substring(separatorIndex + 1);
        let options: any = {};
        switch (command) {
            case EDIT_COMMAND:
                options = { reply_markup: { inline_keyboard: this.getOptionsKeyboard(guid) } }
                await this.bot.sendMessage(chatId, locales.ru.editOptionsMessage, options);
                break;
            case EDIT_FROM_COMMAND:
                await handleAction(this, chatId, context, locales.ru.editFromMessage);
                break;
            case EDIT_TO_COMMAND:
                await handleAction(this, chatId, context, locales.ru.editToMessage);
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
                // add save current action
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