import { Injectable } from '@nestjs/common';
import { CreateCityDto } from './dto/create-city.dto';
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {City} from "./entities/city.entity";
import {UpdateCityDto} from "./dto/update-city.dto";

@Injectable()
export class CitiesService {
  constructor(
      @InjectRepository(City)
      private citiesRepository: Repository<City>,
  ) {}
  create(createCityDto: CreateCityDto) {
    const newCity = this.citiesRepository.create(createCityDto);
    return this.citiesRepository.save(newCity);
  }

  findOne(id: number) {
    return this.citiesRepository.findOneBy({ id });
  }

  findOneByName(name: string) {
    return this.citiesRepository
        .createQueryBuilder('city')
        .innerJoinAndSelect('city.country', 'country')
        .where('city.name = :name', { name })
        .getOne();
  }

  async update(id: number, updateCityDto: UpdateCityDto) {
    const city = await this.findOne(id);
    return this.citiesRepository.save({ ...city, ...updateCityDto });
  }
}
