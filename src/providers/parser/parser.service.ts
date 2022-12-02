import { Injectable } from '@nestjs/common';
const customParseFormat = require('dayjs/plugin/customParseFormat');
import * as dayjs from 'dayjs';
import {LocationService} from "../location/location.service";
import {CreateRequestDirectionDto} from "../../request-directions/dto/create-request-direction.dto";
dayjs.extend(customParseFormat);

@Injectable()
export class ParserService {
  private readonly keys: string[];
  private readonly requiredFields: string[];

  constructor(private readonly locationService: LocationService) {
    this.keys = [
      'from',
      'to',
      'start_date',
      'end_date',
      'what',
      'reward',
    ];
    this.requiredFields = [
      'from',
      'to',
      'start_date',
      'end_date',
    ];
  }

  parseData(message) {
    const messageData: any[] = message.split("\n").map(line => {
      const lineData = line.split(": ")
        .filter(({length}) => length > 1);
      if (this.keys.includes(lineData[0])) {
        const object: any = {};
        object[lineData[0]] = lineData[1];
        return object;
      }
    });
    return messageData.reduce((before, after) => ({...before, ...after}), {})
  }

  prepareDataToRequestObject(data) {
    const object: any = {};
    if (data['from'] && data['from'] !== 'unknown') {
      object['from'] = data['from'].toString().split(',');
    }
    if (data['to'] && data['to'] !== 'unknown') {
      object['to'] = data['to'].toString().split(',');
    }
    if (object['from'] && object['to']) {
      object['directions'] = this.parseDirections(object['from'], object['to']);
    }
    if (data['start_date'] && data['start_date'] !== 'unknown') {
      console.debug(data['start_date']);
      object['dateFrom'] = dayjs(data['start_date'], 'DD-MM-YYYY').toDate();
      console.debug(object['dateFrom']);
    }
    if (data['end_date'] && data['end_date'] !== 'unknown') {
      console.debug(data['end_date']);
      object['dateTo'] = dayjs(data['end_date'], 'DD-MM-YYYY').toDate();
      console.debug(object['dateTo']);
    }
    if (data['what'] && data['what'] !== 'unknown') {
      object['context'] = data['what'];
    }
    if (data['reward'] && data['reward'] !== 'unknown') {
      object['hasReward'] = data['reward'] === 'yes';
    }
    this.requiredFields.forEach(field => {
      if (!Object.keys(object).includes(field)) {
        return null; // invalid object
      }
    });
    return object;
  }

  parseDirections(from: string[], to: string[]) {
    const fromData: any = [];
    const toData: any = [];
    from.forEach((item) => {
      fromData.push(this.locationService.getLocation('from_', item));
    })
    to.forEach((item) => {
      toData.push(this.locationService.getLocation('to_', item));
    })
    const directions: CreateRequestDirectionDto[] = [];
    fromData.forEach((fromLocation) => {
      toData.forEach((toLocation) => {
        const item: CreateRequestDirectionDto = {
          fromCountryId: fromLocation.from_country_id,
          fromCityId: fromLocation.from_city_id,
          toCountryId: toLocation.to_country_id,
          toCityId: toLocation.to_city_id,
        }
        directions.push(item);
      })
    })
    return directions;
  }
}