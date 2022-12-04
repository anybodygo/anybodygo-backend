import { Injectable } from '@nestjs/common';
import { CreateCountryDto } from './dto/create-country.dto';
import { UpdateCountryDto } from './dto/update-country.dto';
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {Country} from "./entities/country.entity";

@Injectable()
export class CountriesService {
  constructor(
      @InjectRepository(Country)
      private countriesRepository: Repository<Country>,
  ) {}
  create(createCountryDto: CreateCountryDto) {
    const newCountry = this.countriesRepository.create(createCountryDto);
    return this.countriesRepository.save(newCountry);
  }

  findOne(id: number) {
    return this.countriesRepository.findOneBy({ id });
  }

  findOneByName(name: string) {
    return this.countriesRepository.findOneBy({ name });
  }

  async update(id: number, updateCountryDto: UpdateCountryDto) {
    const country = await this.findOne(id);
    return this.countriesRepository.save({ ...country, ...updateCountryDto });
  }
}
