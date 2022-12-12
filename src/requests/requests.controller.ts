import {Controller, Get, Post, Body, Param, Query} from '@nestjs/common';
import { RequestsService } from './requests.service';
import { CreateRequestDto } from './dto/create-request.dto';
import {RequestDirectionsService} from "../request-directions/request-directions.service";

@Controller('requests')
export class RequestsController {
  constructor(
      private readonly requestsService: RequestsService,
      private readonly requestDirectionsService: RequestDirectionsService
  ) {}

  @Post()
  async create(@Body() createRequestDto: CreateRequestDto) {
    const newRequest = await this.requestsService.create(createRequestDto);
    createRequestDto.directions.forEach((directionData) => {
      const newDirection = { ...directionData, request: newRequest };
      this.requestDirectionsService.create(newDirection);
    })
    return newRequest;
  }

  @Get()
  async findAll(@Query() query) {
    const [data, total] = await this.requestsService.findAll(query);
    return { data, total }
  }

  @Get(':guid')
  findOne(@Param('guid') guid: string) {
    return this.requestsService.findOne(guid);
  }
}
