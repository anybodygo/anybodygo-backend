import { Injectable } from "@nestjs/common";

@Injectable()
export class ParserService {
  private readonly keys: string[];
  private readonly requiredFields: string[];

  constructor() {
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
      'to'
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
      object['from'] = data['from'];
    }
    if (data['to'] && data['to'] !== 'unknown') {
      object['to'] = data['to'];
    }
    if (data['start_date'] && data['start_date'] !== 'unknown') {
      object['dateFrom'] = data['start_date'];
    }
    if (data['end_date'] && data['end_date'] !== 'unknown') {
      object['dateTo'] = data['end_date'];
    }
    if (data['what'] && data['what'] !== 'unknown') {
      object['message'] = data['what'];
    }
    if (data['reward'] && data['reward'] !== 'unknown') {
      object['isRewardable'] = true;
    }
    this.requiredFields.forEach(field => {
      if (!Object.keys(object).includes(field)) {
        return null; // invalid object
      }
    });
    return object;
  }
}