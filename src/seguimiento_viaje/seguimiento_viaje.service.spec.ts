import { Test, TestingModule } from '@nestjs/testing';
import { SeguimientoViajeService } from './seguimiento_viaje.service';

describe('SeguimientoViajeService', () => {
  let service: SeguimientoViajeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SeguimientoViajeService],
    }).compile();

    service = module.get<SeguimientoViajeService>(SeguimientoViajeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
