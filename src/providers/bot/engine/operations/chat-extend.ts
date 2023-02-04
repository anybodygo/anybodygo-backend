import {locales} from "../../../../config/bot/locales";

const EDIT_FROM_COMMAND: string = 'edit-from';
const EDIT_TO_COMMAND: string = 'edit-to';
const EDIT_DATE_FROM_COMMAND: string = 'edit-date-from';
const EDIT_DATE_TO_COMMAND: string = 'edit-date-to';
const EDIT_WHAT_COMMAND: string = 'edit-what';

export const getChat = async (_this, chatId) => {
    return await _this.chatsRepository.findOneBy({ chatId });
}

export const createChat = async (_this, chatId) => {
    const newChat: any = await _this.chatsRepository.create({ chatId });
    return await _this.chatsRepository.save(newChat);
}

export const updateChat = async (_this, chatId, action) => {
    const chat: any = await getChat(_this, chatId);
    return await _this.chatsRepository.save({ ...chat, action });
}

export const handleAction = async (_this, chatId, context, message, options = {}) => {
    let chat: any = await getChat(_this, chatId);
    if (!chat) {
        chat = await createChat(_this, chatId);
    }
    if (chat) {
        console.debug(chat);
        const response: any = await updateChat(_this, chatId, context);
        if (response) {
            console.debug(response);
            await _this.bot.sendMessage(chatId, message, options);
        }
    }
}

export const getActionDetails = async (_this, chatId, value) => {
    let chat: any = await getChat(_this, chatId);
    if (!chat || (chat && !chat.action)) {
        return null;
    } else {
        const action: string = chat.action;
        const separatorIndex: number = action.indexOf(' ');
        const command = action.substring(0, separatorIndex);
        const guid: string = action.substring(separatorIndex + 1);
        let output: any = { guid };
        switch (command) {
            case EDIT_FROM_COMMAND:
                output.column = 'from';
                // 
                output.value = value;
                break;
            case EDIT_TO_COMMAND:
                output.column = 'to';
                //
                output.value = value;
                break;
            case EDIT_DATE_FROM_COMMAND:
                output.column = 'dateFrom';
                //
                output.value = value;
                break;
            case EDIT_DATE_TO_COMMAND:
                output.column = 'dateTo';
                //
                output.value = value;
                break;
            case EDIT_WHAT_COMMAND:
                output.column = 'context';
                output.value = value;
                break;
        }
    }
}