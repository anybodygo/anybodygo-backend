import { Injectable } from "@nestjs/common";

@Injectable()
export class ParserService {
  private readonly keys: string[];

  constructor() {
    this.keys = [
      'from',
      'to',
      'start_date',
      'end_date',
      'what',
      'reward',
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
}