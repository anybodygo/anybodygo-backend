import {locales} from "../../../config/bot/locales";
import {ParserService} from "../../parser/parser.service";
import {OpenaiService} from "../../openai/openai.service";
import {HttpService} from "@nestjs/axios";

const EDIT_COMMAND: string = 'edit';
const REMOVE_COMMAND: string = 'remove';
const CREATE_REQUEST_COMMAND: string = 'create-request';


export default class CallbackHandler {
    constructor(
        protected readonly parserService: ParserService,
        protected readonly openaiService: OpenaiService,
        protected readonly httpService: HttpService,
        private readonly bot
    ) {}

    async handle(query) {
        try {
            const context = query.data;
            const chatId = query.message.chat.id;
            if (context === CREATE_REQUEST_COMMAND) {
                this.bot.sendMessage(chatId, locales.ru.infoAboutCreation)
                    .then(() => {
                        this.bot.sendMessage(chatId, locales.ru.infoAboutBot);
                    });
            } else if (context.includes(REMOVE_COMMAND)) {
                // @todo: add flow
                this.bot.sendMessage(chatId, locales.ru.noRemoveAvailable);
            } else if (context.includes(EDIT_COMMAND)) {
                // @todo: add flow
                this.bot.sendMessage(chatId, locales.ru.noEditAvailable);
            }
        } catch (exception) {
            console.error(exception);
        }
    }
}