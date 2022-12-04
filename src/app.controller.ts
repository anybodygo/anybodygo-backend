import { BotService } from './providers/bot/bot.service';
import { Get, Controller, Res, HttpStatus } from '@nestjs/common';

@Controller()
export class AppController {
  constructor(
      private readonly botService: BotService
  ) {}

  @Get()
  getBotDialog(@Res() response)
  {
    this.botService.botMessage();
    response.status(HttpStatus.OK).send('Bot service started');
  }
}