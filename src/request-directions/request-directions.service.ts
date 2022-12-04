import { Injectable } from '@nestjs/common';
import { CreateRequestDirectionDto } from './dto/create-request-direction.dto';
import { UpdateRequestDirectionDto } from './dto/update-request-direction.dto';
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {RequestDirection} from "./entities/request-direction.entity";

@Injectable()
export class RequestDirectionsService {
  constructor(
      @InjectRepository(RequestDirection)
      private requestDirectionsRepository: Repository<RequestDirection>,
  ) {}

  create(createDirectionDto: CreateRequestDirectionDto) {
    const newDirection = this.requestDirectionsRepository.create(createDirectionDto);
    return this.requestDirectionsRepository.save(newDirection);
  }

  findAll() {
    return this.requestDirectionsRepository.find();
  }

  findOne(id: number) {
    return this.requestDirectionsRepository.findOneBy({ id });
  }

  async update(id: number, updateDirectionDto: UpdateRequestDirectionDto) {
    const direction = await this.findOne(id);
    return this.requestDirectionsRepository.save({ ...direction, ...updateDirectionDto });
  }

  async remove(id: number) {
    const direction = await this.findOne(id);
    return this.requestDirectionsRepository.remove(direction);
  }
}
