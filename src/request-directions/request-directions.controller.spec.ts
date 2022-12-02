import { Test, TestingModule } from '@nestjs/testing';
import { RequestDirectionsController } from './request-directions.controller';
import { RequestDirectionsService } from './request-directions.service';

describe('RequestDirectionsController', () => {
  let controller: RequestDirectionsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RequestDirectionsController],
      providers: [RequestDirectionsService],
    }).compile();

    controller = module.get<RequestDirectionsController>(RequestDirectionsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
