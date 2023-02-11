import * as dayjs from "dayjs";
import {locales} from "../../../../config/bot/locales";

const EDIT_FROM_COMMAND: string = 'edit-from';
const EDIT_TO_COMMAND: string = 'edit-to';
const EDIT_DATE_FROM_COMMAND: string = 'edit-date-from';
const EDIT_DATE_TO_COMMAND: string = 'edit-date-to';
const EDIT_WHAT_COMMAND: string = 'edit-what';

export const getChat = async (_this, chatId) => {
    return await _this.chatsRepository.findOneBy({ chatId });
}

export const getCity = async (_this, name) => {
    return await _this.citiesRepository
        .createQueryBuilder('city')
        .innerJoinAndSelect('city.country', 'country')
        .where('LOWER(city.name) = :name', { name: name.toLowerCase() })
        .getOne();
}

export const getCountry = async (_this, name) => {
    return await _this.countriesRepository
        .createQueryBuilder('country')
        .where('LOWER(country.name) = :name', { name: name.toLowerCase() })
        .getOne();
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

export const getLocation = async (_this, value) => {
    const city = await getCity(_this, value);
    if (city) {
        return { city };
    } else {
        const country = await getCountry(_this, value);
        if (country) {
            return { country };
        } else {
            return null; // wrong value
        }
    }
}

export const getActionDetails = async (_this, chat, value) => {
    const action: string = chat.action;
    const separatorIndex: number = action.indexOf(' ');
    const command = action.substring(0, separatorIndex);
    const guid: string = action.substring(separatorIndex + 1);
    let output: any = { guid };
    let location: any = null;
    let isValidDate: boolean = false;
    switch (command) {
        case EDIT_FROM_COMMAND:
            output.column = 'from';
            location = await getLocation(_this, value);
            console.debug(location);
            if (!location) {
                return { message: locales.ru.wrongLocationMessage.replace('{value}', value), exception: true };
            }
            output.value = location;
            break;
        case EDIT_TO_COMMAND:
            output.column = 'to';
            location = await getLocation(_this, value);
            console.debug(location);
            if (!location) {
                return { message: locales.ru.wrongLocationMessage.replace('{value}', value), exception: true };
            }
            output.value = location;
            break;
        case EDIT_DATE_FROM_COMMAND:
            output.column = 'dateFrom';
            isValidDate = dayjs(value, 'DD.MM.YYYY', true).isValid();
            if (!isValidDate) {
                return { message: locales.ru.wrongDateMessage, exception: true };
            }
            output.value = dayjs(value, 'DD.MM.YYYY', true).toDate();
            break;
        case EDIT_DATE_TO_COMMAND:
            output.column = 'dateTo';
            isValidDate = dayjs(value, 'DD.MM.YYYY', true).isValid();
            if (!isValidDate) {
                return { message: locales.ru.wrongDateMessage, exception: true };
            }
            output.value = dayjs(value, 'DD.MM.YYYY', true).toDate();
            break;
        case EDIT_WHAT_COMMAND:
            output.column = 'context';
            output.value = value;
            break;
        default:
            return undefined;
    }
    return output;
}