import { Test, TestingModule } from '@nestjs/testing';
import { RequestDirectionsService } from './request-directions.service';

describe('RequestDirectionsService', () => {
  let service: RequestDirectionsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RequestDirectionsService],
    }).compile();

    service = module.get<RequestDirectionsService>(RequestDirectionsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
