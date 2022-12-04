import {BadRequestException, Injectable} from '@nestjs/common';
import { CreateRequestDto } from './dto/create-request.dto';
import {InjectRepository} from "@nestjs/typeorm";
import {Request} from './entities/request.entity';
import {Repository} from "typeorm";

const LIMIT: number = 10;
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

  findAll(conditions: any = null) {
    const query = this.requestsRepository.createQueryBuilder('request');
    if (conditions) {
      query.innerJoin('request.directions', 'direction');
      if (conditions.fromCountryId) {
        query.where(
            'direction.fromCountryId = :fromCountryId',
            { fromCountryId: +conditions.fromCountryId });
      }
      if (conditions.toCountryId) {
        query.where(
            'direction.toCountryId = :toCountryId',
            { toCountryId: +conditions.toCountryId });
      }
      if (conditions.fromCityId) {
        query.where(
            'direction.fromCityId = :fromCityId',
            { fromCityId: +conditions.fromCityId });
      }
      if (conditions.toCityId) {
        query.where(
            'direction.toCityId = :toCityId',
            { toCityId: +conditions.toCityId });
      }
      if (conditions.dateFrom) {
        query.where(
            'request.dateFrom <= :dateFrom',
            { dateFrom: conditions.dateFrom });
      }
      if (conditions.dateTo) {
        query.where(
            'request.dateTo >= :dateTo',
            { dateTo: conditions.dateTo });
      }
      if (conditions.hasReward) {
        const hasReward = +conditions.hasReward;
        query.where(
            'request.hasReward = :hasReward',
            { hasReward });
      }
    }
    return query.limit(LIMIT).getMany();
  }

  findOne(guid: string) {
    return this.requestsRepository.findOneBy({ guid });
  }
}
