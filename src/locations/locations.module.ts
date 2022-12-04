import { Module } from '@nestjs/common';
import { CountriesService } from '../countries/countries.service';
import { CitiesService } from '../cities/cities.service';
import {TypeOrmModule} from "@nestjs/typeorm";
import {Country} from "../countries/entities/country.entity";
import {City} from "../cities/entities/city.entity";
import {LocationParserService} from "../providers/location-parser/location-parser.service";
import {LocationsController} from "./locations.controller";
import {LocationService} from "../providers/location/location.service";

@Module({
    imports: [
        TypeOrmModule.forFeature([Country, City])
    ],
    controllers: [LocationsController],
    providers: [
        CountriesService,
        CitiesService,
        LocationParserService,
        LocationService
    ]
})
export class LocationsModule {}
