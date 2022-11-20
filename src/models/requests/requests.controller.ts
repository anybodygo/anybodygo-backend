import { Post, Controller, Req, Get } from "@nestjs/common";
import { Request } from 'express';
import { HttpService } from "@nestjs/axios";
import { RequestsService } from './requests.service';

@Controller('api/requests')
export class RequestsController {
  constructor(
    private readonly httpService: HttpService,
    private readonly requestsService: RequestsService,
  ) {}

  @Get()
  index(@Req() request: Request) {
    const items = this.requestsService.findAll();
    console.log(items);
  }

  @Post()
  store(@Req() request: Request) {
    return {
      link: `${process.env.SERVER_URL}/requests?from=Залупляндия&to=Hell`
    };
  }
}