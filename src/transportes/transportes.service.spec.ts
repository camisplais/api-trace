import { Test, TestingModule } from '@nestjs/testing';
import { TransportesService } from './transportes.service';

describe('TransportesService', () => {
  let service: TransportesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TransportesService],
    }).compile();

    service = module.get<TransportesService>(TransportesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
