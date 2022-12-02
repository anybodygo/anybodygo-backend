import { Injectable } from '@nestjs/common';
import { CreateRequestDirectionDto } from './dto/create-request-direction.dto';
import { UpdateRequestDirectionDto } from './dto/update-request-direction.dto';

@Injectable()
export class RequestDirectionsService {
  create(createRequestDirectionDto: CreateRequestDirectionDto) {
    return 'This action adds a new requestDirection';
  }

  findAll() {
    return `This action returns all requestDirections`;
  }

  findOne(id: number) {
    return `This action returns a #${id} requestDirection`;
  }

  update(id: number, updateRequestDirectionDto: UpdateRequestDirectionDto) {
    return `This action updates a #${id} requestDirection`;
  }

  remove(id: number) {
    return `This action removes a #${id} requestDirection`;
  }
}
