import { Module } from '@nestjs/common';
import { CountriesService } from './countries.service';
import {TypeOrmModule} from "@nestjs/typeorm";
import {Country} from "./entities/country.entity";

@Module({
  imports: [TypeOrmModule.forFeature([Country])],
  providers: [CountriesService]
})
export class CountriesModule {}
