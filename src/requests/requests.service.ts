import {BadRequestException, Injectable} from '@nestjs/common';
import { CreateRequestDto } from './dto/create-request.dto';
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

  findOne(guid: string) {
    return this.requestsRepository.findOneBy({ guid });
  }
}
