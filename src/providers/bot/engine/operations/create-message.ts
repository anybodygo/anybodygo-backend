import {locales} from "../../../../config/bot/locales";
import * as dayjs from "dayjs";


export default class CreateMessage {

    createRequestMessage(request): string
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

}