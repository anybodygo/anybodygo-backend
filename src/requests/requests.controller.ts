import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { RequestsService } from './requests.service';
import { CreateRequestDto } from './dto/create-request.dto';
import {RequestDirectionsService} from "../request-directions/request-directions.service";
// import { UpdateRequestDto } from './dto/update-request.dto';

@Controller('requests')
export class RequestsController {
  constructor(
      private readonly requestsService: RequestsService,
      private readonly requestDirectionsService: RequestDirectionsService
  ) {}

  @Post()
  async create(@Body() createRequestDto: CreateRequestDto) {
    let directions = [];
    if (createRequestDto.directions) {
      directions = createRequestDto.directions;
      delete createRequestDto.directions;
    }
    const newRequest = await this.requestsService.create(createRequestDto);
    directions.forEach((directionData) => {
      const newDirection = { ...directionData, request: newRequest };
      this.requestDirectionsService.create(newDirection);
    })
  }

  @Get()
  findAll() {
    return this.requestsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.requestsService.findOne(+id);
  }
}
