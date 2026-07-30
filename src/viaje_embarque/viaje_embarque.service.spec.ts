import { Test, TestingModule } from '@nestjs/testing';
import { ViajeEmbarqueService } from './viaje_embarque.service';

describe('ViajeEmbarqueService', () => {
  let service: ViajeEmbarqueService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ViajeEmbarqueService],
    }).compile();

    service = module.get<ViajeEmbarqueService>(ViajeEmbarqueService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
