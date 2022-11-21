import { GpTs } from 'gpts';
import { Injectable } from "@nestjs/common";
import { TRAILS_BEFORE, TRAILS_AFTER } from '../../config/openai/trails';

@Injectable()
export class OpenaiService {
  private readonly engineId: string;
  constructor() {
    this.engineId = process.env.OPENAI_MODEL;
  }
  private brain: GpTs;

  async handleMessage(message, prefix = '') {
    this.brain = new GpTs(process.env.OPENAI_APIKEY);
    return this.brain.completion({
      engineId: this.engineId,
      prompt: `${TRAILS_BEFORE}${prefix}${message}${TRAILS_AFTER}`,
      max_tokens: 70,
      temperature: 0,
      n: 1,
      stop: '\n###'
    });
  }
}