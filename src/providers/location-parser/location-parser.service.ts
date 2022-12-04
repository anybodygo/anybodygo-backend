import { Injectable } from '@nestjs/common';
import {XMLParser} from "fast-xml-parser";
import * as fs from "fs";
import * as path from "path";
import {CountriesService} from "../../countries/countries.service";
import {CitiesService} from "../../cities/cities.service";

@Injectable()
export class LocationParserService {
    private readonly source: string;
    private parser: XMLParser;

    constructor(
        private readonly countriesService: CountriesService,
        private readonly citiesService: CitiesService
    )
    {
        this.parser = new XMLParser();
        this.source = path.resolve(__dirname, '../../resources/files/location.xml');
    }

    public parse()
    {
        const fileContent: string = fs.readFileSync(this.source, 'utf8');
        const jsonObject: any = this.parser.parse(fileContent);
        const countries: any = jsonObject.data.country;
        const cities: any = jsonObject.data.city;
        countries.forEach(async (countryObject) => {
            const country = await this.countriesService.findOne(+countryObject.country_id);
            if (!country) {
                const newCountry: any = {
                    id: +countryObject.country_id,
                    name: countryObject.name,
                };
                this.countriesService.create(newCountry).then((entity) => {
                    console.debug(entity);
                }).catch((error) => {
                    console.error(error);
                });
            } else {
                console.debug(country);
            }
        })
        cities.forEach(async (cityObject) => {
            let city = await this.citiesService.findOne(+cityObject.city_id);
            if (!city) {
                const country = await this.countriesService.findOne(+cityObject.country_id);
                const newCity: any = {
                    id: +cityObject.city_id,
                    country: country,
                    name: cityObject.name,
                };
                this.citiesService.create(newCity).then((entity) => {
                    console.debug(entity);
                }).catch((error) => {
                    console.error(error);
                });
            }
        });
        this.citiesService.findOneByName('Бали').then((cityEntity) => {
            if (!cityEntity) {
                const country = this.countriesService.findOneByName('Индонезия').then((countryEntity) => {
                    if (countryEntity) {
                        const newCity: any = {
                            id: 20000000, // unique id
                            country: countryEntity,
                            name: 'Бали',
                        };
                        this.citiesService.create(newCity).then((entity) => {
                            console.debug(entity);
                        }).catch((error) => {
                            console.error(error);
                        });
                    }
                });
            }
        });
    }
}