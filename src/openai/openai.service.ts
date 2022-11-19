import { GpTs } from 'gpts';
import { Injectable } from "@nestjs/common";

@Injectable()
export class OpenaiService {
  private readonly engineId: string;
  constructor() {
    this.engineId = process.env.OPENAI_MODEL;
  }
  private brain: GpTs;

  async handleMessage(message) {
    this.brain = new GpTs(process.env.OPENAI_APIKEY);
    return this.brain.completion({
      engineId: this.engineId,
      prompt: message,
    });
  }
}