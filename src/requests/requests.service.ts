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

  findAll(conditions: any = null) {
    const take = 10; // each page contains 10 items
    const page = conditions.page || 1;
    const skip = (page - 1) * take;
    const query = this.requestsRepository.createQueryBuilder('request');
    if (conditions) {
      query.leftJoin('request.directions', 'direction');
      if (conditions.fromCountryId) {
        query.andWhere(
            'direction.fromCountryId = :fromCountryId',
            { fromCountryId: +conditions.fromCountryId });
      }
      if (conditions.toCountryId) {
        query.andWhere(
            'direction.toCountryId = :toCountryId',
            { toCountryId: +conditions.toCountryId });
      }
      if (conditions.fromCityId) {
        query.andWhere(
            'direction.fromCityId = :fromCityId',
            { fromCityId: +conditions.fromCityId });
      }
      if (conditions.toCityId) {
        query.andWhere(
            'direction.toCityId = :toCityId',
            { toCityId: +conditions.toCityId });
      }
      if (conditions.dateFrom) {
        query.andWhere(
            'request.dateFrom <= :dateFrom AND request.dateTo >= :dateFrom',
            { dateFrom: conditions.dateFrom });
      }
      if (conditions.dateTo) {
        query.andWhere(
            'request.dateTo >= :dateTo',
            { dateTo: conditions.dateTo });
      }
      if (conditions.hasReward) {
        const hasReward = +conditions.hasReward;
        query.andWhere(
            'request.hasReward = :hasReward',
            { hasReward });
      }
      if (conditions.userId) {
        const userId = +conditions.userId;
        query.andWhere(
            'request.userId = :userId',
            { userId });
      }
    }
    return query.take(take).skip(skip).orderBy('request.dateTo').getManyAndCount();
  }

  findOne(guid: string) {
    return this.requestsRepository.findOneBy({ guid });
  }
}
