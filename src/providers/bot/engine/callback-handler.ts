import {locales} from "../../../config/bot/locales";
import {ParserService} from "../../parser/parser.service";
import {OpenaiService} from "../../openai/openai.service";
import {HttpService} from "@nestjs/axios";
import EditOperation from "./operations/edit-operation";
import MessageHandler from "./message-handler";

const START_COMMAND: string = 'start';
const EDIT_COMMAND: string = 'edit';
const REMOVE_COMMAND: string = 'remove';
const CREATE_REQUEST_COMMAND: string = 'create-request';


export default class CallbackHandler {
    private editHandler: EditOperation;
    private messageHandler: MessageHandler;

    constructor(
        protected readonly parserService: ParserService,
        protected readonly openaiService: OpenaiService,
        protected readonly httpService: HttpService,
        private readonly bot
    ) {
        this.editHandler = new EditOperation(bot, parserService, openaiService, httpService);
        this.messageHandler = new MessageHandler(parserService, openaiService, httpService, bot);
    }

    async handle(query) {
        try {
            const context = query.data;
            const chatId = query.message.chat.id;
            const userId = query.from.id;
            if (context === CREATE_REQUEST_COMMAND) {
                this.bot.sendMessage(chatId, locales.ru.infoAboutCreation)
                    .then(() => {
                        this.bot.sendMessage(chatId, locales.ru.infoAboutBot);
                    });
            } else if (context.includes(REMOVE_COMMAND)) {
                // @todo: add flow
                this.bot.sendMessage(chatId, locales.ru.noRemoveAvailable);
            } else if (context.includes(EDIT_COMMAND)) {
                await this.editHandler.handle(context, chatId);
            } else if (context === START_COMMAND) {
                const requests = await this.messageHandler.getRequests(userId);
                if (requests.length) {
                    this.messageHandler.handleRequests(chatId, requests);
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
            }
        } catch (exception) {
            console.error(exception.message);
            console.error('Context: ', query);
        }
    }
}