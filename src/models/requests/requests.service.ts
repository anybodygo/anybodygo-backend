import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Request } from './entities/request.entity';

@Injectable()
export class RequestsService {
  constructor(
    @InjectRepository(Request)
    private requestsRepository: Repository<Request>,
  ) {}

  findAll(): Promise<Request[]> {
    return this.requestsRepository.find();
  }

  findOne(id: number): Promise<Request> {
    return this.requestsRepository.findOneBy({ id });
  }

  async remove(id: string): Promise<void> {
    await this.requestsRepository.delete(id);
  }
}