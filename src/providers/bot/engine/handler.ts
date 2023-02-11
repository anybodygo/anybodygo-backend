import CallbackHandler from "./callback-handler";
import MessageHandler from "./message-handler";
import {ParserService} from "../../parser/parser.service";
import {OpenaiService} from "../../openai/openai.service";
import {HttpService} from "@nestjs/axios";
import ReadChat from "./operations/read-chat";


export default class Handler {
    private readonly callbackHandler: CallbackHandler;
    private readonly messageHandler: MessageHandler;
    private readonly chatReader: ReadChat;

    constructor(
        parserService: ParserService,
        openaiService: OpenaiService,
        httpService: HttpService,
        protected readonly bot
    ) {
        this.callbackHandler = new CallbackHandler(parserService, openaiService, httpService, bot);
        this.messageHandler = new MessageHandler(parserService, openaiService, httpService, bot);
        this.chatReader = new ReadChat(parserService, openaiService, httpService, bot);
    }

    async handleMessage(message) {
        await this.messageHandler.handle(message);
    }

    async handleCallback(query) {
        await this.callbackHandler.handle(query);
    }

    async readChat(message) {
        await this.chatReader.handle(message);
    }
}