import {BadRequestException, Injectable} from '@nestjs/common';
import { CreateRequestDto } from './dto/create-request.dto';
import { UpdateRequestDto } from './dto/update-request.dto';
import {InjectRepository} from "@nestjs/typeorm";
import {Request} from './entities/request.entity';
import {Repository} from "typeorm";

@Injectable()
export class RequestsService {
  constructor(
      @InjectRepository(Request)
      private requestsRepository: Repository<Request>,
  ) {}

  create(createRequestDto: CreateRequestDto) {
    const newRequest = this.requestsRepository.create(createRequestDto);
    return this.requestsRepository.save(newRequest).catch((error) => {
      if (error) {
        throw new BadRequestException(
            'Request with this [messageId, chatId, userId] already exists.',
        );
      }
      return error;
    });
  }

  findAll() {
    return this.requestsRepository.find({
      order: {
        dateTo: 'ASC'
      },
      withDeleted: false,
    });
  }

  findOne(id: number) {
    return this.requestsRepository.findOneBy({ id });
  }

  async update(id: number, updateRequestDto: UpdateRequestDto) {
    const request = await this.findOne(id);
    return this.requestsRepository.save({ ...request, ...updateRequestDto });
  }

  async remove(id: number) {
    const request = await this.findOne(id);
    return this.requestsRepository.remove(request);
  }
}
