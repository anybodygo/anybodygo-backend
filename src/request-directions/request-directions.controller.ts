import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { RequestDirectionsService } from './request-directions.service';
import { CreateRequestDirectionDto } from './dto/create-request-direction.dto';
import { UpdateRequestDirectionDto } from './dto/update-request-direction.dto';

@Controller('request-directions')
export class RequestDirectionsController {
  /** unused controller --- safe to close it */
  /*
  constructor(private readonly requestDirectionsService: RequestDirectionsService) {}

  @Post()
  create(@Body() createRequestDirectionDto: CreateRequestDirectionDto) {
    return this.requestDirectionsService.create(createRequestDirectionDto);
  }

  @Get()
  findAll() {
    return this.requestDirectionsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.requestDirectionsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRequestDirectionDto: UpdateRequestDirectionDto) {
    return this.requestDirectionsService.update(+id, updateRequestDirectionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.requestDirectionsService.remove(+id);
  }
   */
}
