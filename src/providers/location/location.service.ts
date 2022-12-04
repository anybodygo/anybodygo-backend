import { Injectable } from '@nestjs/common';
import {CountriesService} from "../../countries/countries.service";
import {CitiesService} from "../../cities/cities.service";

@Injectable()
export class LocationService {
  constructor(
      private readonly countriesService: CountriesService,
      private readonly citiesService: CitiesService
  ) {}
  public async getLocation(prefix: string, value: string)
  {
    const cityKey: string = `${prefix}_city_id`;
    const countryKey: string = `${prefix}_country_id`;
    const object: any = {};
    const country = await this.countriesService.findOneByName(value);
    if (country) {
      object[countryKey] = country.id;
    } else {
      const city = await this.citiesService.findOneByName(value);
      if (city) {
        object[countryKey] = city.country.id;
        object[cityKey] = city.id;
      } else {
        console.error(`There are no cities and countries with name: ${value}`);
      }
    }
    return Object.keys(object).length ? object : null;
  }
}