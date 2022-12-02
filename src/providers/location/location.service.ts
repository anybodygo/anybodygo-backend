import { Injectable } from '@nestjs/common';

@Injectable()
export class LocationService {
  public getLocation(prefix: string, value: string)
  {
    const cityKey: string = `${prefix}_city_id`;
    const countryKey: string = `${prefix}_country_id`;
    const object: any = {};
    object[cityKey] = 1; // test value
    object[countryKey] = 1; // test value
    return object;
  }
}